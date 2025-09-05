import { Driver, RecordShape, Session } from 'neo4j-driver';
import { connect } from './connection';
import { getSessionOptions } from '../../_helpers/db-helper';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import { NodeType } from '../../_helpers/nodes';
import Config from '../../config/config';

export enum Errors {
	CANNOT_CREATE_NODE = 'Cannot Create Node',
	CANNOT_MATCH_NODE = 'Cannot Match Node',
	CANNOT_DELETE_NODE = 'Cannot Delete Node',
	CANNOT_UPDATE_NODE = 'Cannot Update Node',
	CANNOT_GET_TOTAL_NODES = 'Cannot Get Total Nodes',
	NO_NODES_CREATED = 'No Nodes Were Created',
	NO_NODES_DELETED = 'No Nodes Were Deleted',
}

export async function createNode(nodeType: NodeType, idProps: string[], params: object, dbName: string = Config.PAIRINGS_DB): Promise<any | null> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(dbName));

	let createdNode: object | null = null;

	try {
		const match: RecordShape = await session.run(`CREATE(n:${nodeType} { ${idProps.join(', ')} }) RETURN n`, params);

		if (match.summary.counters._stats.nodesCreated !== 1) {
			await session.close();
			await driver.close();

			throw new InternalError(Errors.NO_NODES_CREATED);
		} else {
			createdNode = match.records[0].get(0).properties;
		}
	} catch (error: unknown) {
		await session.close();
		await driver.close();

		throw new InternalError(Errors.CANNOT_CREATE_NODE, { cause: error });
	}

	await session.close();
	await driver.close();

	return createdNode;
}

export async function getNode(
	nodeType: string,
	idProps: string[],
	params: object,
	dbName: string = Config.PAIRINGS_DB,
	existingSession?: Session
): Promise<any | null> {
	let driver: Driver | null = null;
	let session: Session;

	if (existingSession) {
		session = existingSession;
	} else {
		driver = await connect();
		session = driver.session(getSessionOptions(dbName));
	}

	let matchedNode: any | null = null;

	try {
		const match: RecordShape = await session.run(`MATCH(n:${nodeType} { ${idProps.join(', ')} }) RETURN n`, params);

		/* istanbul ignore next line */
		if (match.records.length === 1) {
			matchedNode = match.records[0].get(0).properties;
		}
	} catch (error: unknown) {
		/* istanbul ignore next line */
		if (driver) {
			await session.close();
			await driver.close();
		}

		throw new InternalError(Errors.CANNOT_MATCH_NODE, { cause: error });
	}

	if (driver) {
		await session.close();
		await driver.close();
	}

	return matchedNode;
}

export async function getNodes(nodeType: string, orderByClause?: string, limit?: number | null, whereClause?: string): Promise<any[]> {
	const nodes: any[] = [];
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	const match = await session.run(
		`MATCH (n:${nodeType}) ${whereClause ? 'WHERE ' + whereClause : ''} RETURN n ${orderByClause ? 'ORDER BY ' + orderByClause : ''} ${
			limit ? 'LIMIT ' + limit : ''
		}`
	);

	match.records.map(record => {
		nodes.push(record.get(0).properties);
	});

	await session.close();
	await driver.close();
	return nodes;
}

export async function getTotalNodeCountByType(nodeType: NodeType): Promise<number> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	let count = 0;

	try {
		const match = await session.run(`MATCH (n:${nodeType}) RETURN COUNT(n) AS count`);
		count = match.records[0]!.get('count').toNumber();
	} catch (error) {
		throw new InternalError(Errors.CANNOT_GET_TOTAL_NODES, { cause: error });
	} finally {
		await session.close();
		await driver.close();
	}

	return count;
}

export async function deleteNode(nodeType: NodeType, idProps: string[], params: object, dbName: string = Config.PAIRINGS_DB): Promise<any | null> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(dbName));

	const matchedNode: any | null = await getNode(nodeType, idProps, params, dbName, session);

	/* istanbul ignore next line */
	if (matchedNode) {
		let match: RecordShape;

		try {
			match = await session.run(`MATCH(n:${nodeType} { ${idProps.join(', ')} }) DETACH DELETE n`, params);

			if (match.summary.counters._stats.nodesDeleted !== 1) {
				await session.close();
				await driver.close();
				throw new InternalError(Errors.NO_NODES_DELETED);
			}
		} catch (error: unknown) {
			await session.close();
			await driver.close();

			throw new InternalError(Errors.CANNOT_DELETE_NODE, { cause: error });
		}
	}

	await session.close();
	await driver.close();

	return matchedNode;
}

// idProp should have a corresponding property name in the params obj
// e.g. if idProp = "email", the params object should at least contain { email: "some@email.com" }
export async function updateNode(
	nodeType: NodeType,
	nodePrefix: string,
	idProps: string[],
	updatedProps: string[],
	params: object,
	dbName: string = Config.PAIRINGS_DB
): Promise<any | null> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(dbName));

	let match: RecordShape | null = null;

	try {
		match = await session.run(
			`MATCH(${nodePrefix}:${nodeType} { ${idProps.join(', ')} }) SET ${updatedProps.join(', ')} RETURN ${nodePrefix}`,
			params
		);
	} catch (error: unknown) {
		await session.close();
		await driver.close();

		throw new InternalError(Errors.CANNOT_UPDATE_NODE, { cause: error });
	}

	if (match && match.records.length === 0) {
		await session.close();
		await driver.close();

		return null;
	}

	await session.close();
	await driver.close();

	return match.records[0].get(0).properties;
}

export async function removeProperties(
	nodeType: NodeType,
	nodePrefix: string,
	idProps: string[],
	propsToRemove: string[],
	params: object,
	dbName: string = Config.PAIRINGS_DB
): Promise<any | null> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(dbName));

	let match: RecordShape | null = null;

	try {
		match = await session.run(
			`MATCH(${nodePrefix}:${nodeType} { ${idProps.join(', ')} }) REMOVE ${propsToRemove.join(', ')} RETURN ${nodePrefix}`,
			params
		);
	} catch (error: unknown) {
		await session.close();
		await driver.close();

		throw new InternalError(Errors.CANNOT_UPDATE_NODE, { cause: error });
	}

	if (match && match.records.length === 0) {
		await session.close();
		await driver.close();

		return null;
	}

	await session.close();
	await driver.close();

	return match.records[0].get(0).properties;
}
