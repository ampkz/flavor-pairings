import { Driver, Record, RecordShape, Session } from 'neo4j-driver';
import { Node, NodeType, Relationship, RelationshipType } from '../../../_helpers/nodes';
import { connect } from '../connection';
import { getSessionOptions } from '../../../_helpers/db-helper';
import Config from '../../../config/config';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import { Errors as CRUDErrors } from '../crud';

export enum Errors {
	COULD_NOT_CREATE_RELATIONSHIP = 'Could not create relationship.',
	COULD_NOT_DELETE_RELATIONSHIP = 'Could not delete relationship.',
	COULD_NOT_GET_RELATIONSHIPS = 'Could not get relationships.',
	COULD_NOT_UPDATE_RELATIONSHIP = 'Could not update relationship.',
}

export async function createRelationship(relationship: Relationship): Promise<[any | null, any | null, any | null]> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	let query = `
		CALL () {
			MATCH (n:${relationship.node1.nodeType} {${relationship.node1.getIdString('n1')}})-[:${RelationshipType.REFERENCES}]->(n1:${
		relationship.node1.nodeType
	})
			RETURN n1
		UNION
			MATCH (n1:${relationship.node1.nodeType} {${relationship.node1.getIdString('n1')}})
			RETURN n1
		}
		MATCH (n1)-[r:${relationship.type} {${relationship.hasIdProp() ? relationship.getIdString('r') : ''}}]-(n2:${
		relationship.node2.nodeType
	} {${relationship.node2.getIdString('n2')}})
		RETURN n1, n2, r
	`;

	let match: RecordShape = await session.run(query, relationship.getRelationshipParams('n1', 'n2', 'r'));

	if (match.records.length > 0) {
		await session.close();
		await driver.close();
		return [null, null, null];
	}

	query = `
		CYPHER 25
		MATCH (n1:${relationship.node1.nodeType} {${relationship.node1.getIdString('n1')}}),
		(n2:${relationship.node2.nodeType} {${relationship.node2.getIdString('n2')}})
		OPTIONAL MATCH (n1)-[:${RelationshipType.REFERENCES}]->(n1ref:${relationship.node1.nodeType})
		OPTIONAL MATCH (n2)-[:${RelationshipType.REFERENCES}]->(n2ref:${relationship.node2.nodeType})
		RETURN n1ref, n1, n2, n2ref

		NEXT

		WHEN n1ref IS NOT NULL THEN {
			CREATE (n1ref)-[r:${relationship.type} ${relationship.hasIdProp() ? '{' + relationship.getIdString('r') + '}' : ''}]->(n2)
			RETURN n1ref AS n1, n2, r
		} 
		
		WHEN n2ref IS NOT NULL THEN {
			CREATE (n1)-[r:${relationship.type} ${relationship.hasIdProp() ? '{' + relationship.getIdString('r') + '}' : ''}]->(n2ref)
			RETURN n1, n2ref AS n2, r
		} 
		
		ELSE {
			CREATE (n1)-[r:${relationship.type} ${relationship.hasIdProp() ? '{' + relationship.getIdString('r') + '}' : ''}]->(n2)
			RETURN n1, n2, r
		}
	`;

	try {
		match = await session.run(query, relationship.getRelationshipParams('n1', 'n2', 'r'));
	} catch (error) {
		throw new InternalError(Errors.COULD_NOT_CREATE_RELATIONSHIP, { cause: error });
	} finally {
		await session.close();
		await driver.close();
	}

	if (match.summary.counters._stats.relationshipsCreated !== 1) {
		return [null, null, null];
	}

	return [
		match.records[0].get('n1').properties,
		match.records[0].get('n2').properties,
		{ type: match.records[0].get('r').type, ...match.records[0].get('r').properties },
	];
}

export async function getRelationshipsToNode(
	node: Node,
	secondNodeType: NodeType,
	relationshipType: RelationshipType,
	undirectedMatch: boolean = false,
	orderByClause?: string,
	limit?: number | null,
	whereClause?: string
): Promise<any[]> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	let match: RecordShape;

	const query = `
		CALL () {
			MATCH (n:${node.nodeType} { ${node.getIdString()} })-[:${RelationshipType.REFERENCES}]->(n1:${node.nodeType})-[r:${relationshipType}]-${
		undirectedMatch ? '' : '>'
	}(n2:${secondNodeType}) ${whereClause ? `WHERE ${whereClause}` : ''}
			RETURN r, n2
		UNION
			MATCH (n1:${node.nodeType} { ${node.getIdString()} })-[r:${relationshipType}]-${undirectedMatch ? '' : '>'}(n2:${secondNodeType}) ${
		whereClause ? `WHERE ${whereClause}` : ''
	}
			RETURN r, n2
		}
		RETURN r, n2 ${orderByClause ? `ORDER BY ${orderByClause}` : ''} ${limit ? `LIMIT ${limit}` : ''}
	`;

	try {
		match = await session.run(query, node.getIdParams());
	} catch (error) {
		throw new InternalError(Errors.COULD_NOT_GET_RELATIONSHIPS, { cause: error });
	} finally {
		await session.close();
		await driver.close();
	}

	return match.records.map((record: Record) => [record.get('n2').properties, { type: record.get('r').type, ...record.get('r').properties }]);
}

export async function getTotalRelationshipsToNodes(
	node: Node,
	secondNodeType: NodeType,
	relationshipType: RelationshipType,
	undirectedMatch: boolean = true
): Promise<number> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	let count = 0;

	const query = `
		CALL () {
			MATCH (n:${node.nodeType} { ${node.getIdString()} })-[:${RelationshipType.REFERENCES}]->(n1:${node.nodeType})-[r:${relationshipType}]-${
		undirectedMatch ? '' : '>'
	}(n2:${secondNodeType})
			RETURN count(r) AS totalNodes
		UNION
			MATCH (n1:${node.nodeType} { ${node.getIdString()} })-[r:${relationshipType}]-${undirectedMatch ? '' : '>'}(n2:${secondNodeType})
			RETURN count(r) AS totalNodes
		}
		RETURN sum(totalNodes) AS totalNodes
	`;

	try {
		const match = await session.run(query, node.getIdParams());
		count = match.records[0]!.get('totalNodes').toNumber();
	} catch (error) {
		throw new InternalError(CRUDErrors.CANNOT_GET_TOTAL_NODES, { cause: error });
	} finally {
		await session.close();
		await driver.close();
	}

	return count;
}

export async function deleteRelationship(relationship: Relationship, undirectedMatch: boolean = false): Promise<[any | null, any | null]> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	let match: RecordShape;

	const query = `
		CALL () {
			MATCH (n:${relationship.node1.nodeType} {${relationship.node1.getIdString('n1')}})-[:${RelationshipType.REFERENCES}]->(n1:${
		relationship.node1.nodeType
	})-[r:${relationship.type} {${relationship.hasIdProp() ? relationship.getIdString('r') : ''}}]-${undirectedMatch ? '' : '>'}(n2:${
		relationship.node2.nodeType
	} {${relationship.node2.getIdString('n2')}})
			RETURN n1, n2, r
		UNION
			MATCH (n1:${relationship.node1.nodeType} {${relationship.node1.getIdString('n1')}})-[r:${relationship.type} {${
		relationship.hasIdProp() ? relationship.getIdString('r') : ''
	}}]-${undirectedMatch ? '' : '>'}(n2:${relationship.node2.nodeType} {${relationship.node2.getIdString('n2')}})
			RETURN n1, n2, r
		}
		DELETE r
		RETURN n1, n2
	`;

	try {
		match = await session.run(query, relationship.getRelationshipParams('n1', 'n2', 'r'));
	} catch (error) {
		throw new InternalError(Errors.COULD_NOT_DELETE_RELATIONSHIP, { cause: error });
	} finally {
		await session.close();
		await driver.close();
	}

	if (match.summary.counters._stats.relationshipsDeleted !== 1) {
		return [null, null];
	}

	return [match.records[0].get('n1').properties, match.records[0].get('n2').properties];
}

export async function updateRelationship(
	relationship: Relationship,
	updatedIdProps: string[],
	updatedIdParams: object,
	undirectedMatch: boolean = false
): Promise<[any | null, any | null, any | null]> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	let match: RecordShape;

	const query = `
		CALL () {
			MATCH (n:${relationship.node1.nodeType} {${relationship.node1.getIdString('n1')}})-[:${RelationshipType.REFERENCES}]-${
		undirectedMatch ? '' : '>'
	}(n1:${relationship.node1.nodeType})-[r:${relationship.type} ${relationship.hasIdProp() ? `{${relationship.getIdString('r')}}` : ''}]-(n2:${
		relationship.node2.nodeType
	} {${relationship.node2.getIdString('n2')}})
			RETURN n1, n2, r
		UNION
			MATCH (n1:${relationship.node1.nodeType} {${relationship.node1.getIdString('n1')}})-[r:${relationship.type} ${
		relationship.hasIdProp() ? `{${relationship.getIdString('r')}}` : ''
	}]-(n2:${relationship.node2.nodeType} {${relationship.node2.getIdString('n2')}})
			RETURN n1, n2, r
		}
		SET ${updatedIdProps.map(prop => `r.${prop} = $${prop}`).join(', ')}
		RETURN n1, n2, r
	`;

	try {
		match = await session.run(query, { ...updatedIdParams, ...relationship.getRelationshipParams('n1', 'n2', 'r') });
	} catch (error) {
		throw new InternalError(Errors.COULD_NOT_UPDATE_RELATIONSHIP, { cause: error });
	} finally {
		await session.close();
		await driver.close();
	}

	if (match.records.length === 0) {
		return [null, null, null];
	}

	return [
		match.records[0].get('n1').properties,
		match.records[0].get('n2').properties,
		{ type: match.records[0].get('r').type, ...match.records[0].get('r').properties },
	];
}

export async function deleteAllRelationships(node: Node): Promise<boolean> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	let success = false;

	const query = `
		MATCH (n:${node.nodeType} { ${node.getIdString()} })-[r]-()
		DELETE r
	`;

	try {
		const match = await session.run(query, node.getIdParams());
		success = match.summary.updateStatistics.updates().relationshipsDeleted > 0;
	} catch (error) {
		throw new InternalError(Errors.COULD_NOT_DELETE_RELATIONSHIP, { cause: error });
	} finally {
		await session.close();
		await driver.close();
	}

	return success;
}
