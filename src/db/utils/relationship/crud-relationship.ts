import { Driver, Record, RecordShape, Session } from 'neo4j-driver';
import { Node, NodeType, Relationship, RelationshipType } from '../../../_helpers/nodes';
import { connect } from '../connection';
import { getSessionOptions } from '../../../_helpers/db-helper';
import Config from '../../../config/config';
import { InternalError } from '@ampkz/auth-neo4j/errors';

export enum Errors {
	NO_RELATIONSHIP_CREATED = 'No relationship created.',
	COULD_NOT_CREATE_RELATIONSHIP = 'Could not create relationship.',
	COULD_NOT_DELETE_RELATIONSHIP = 'Could not delete relationship.',
	COULD_NOT_GET_RELATIONSHIPS = 'Could not get relationships.',
}

export async function createRelationship(relationship: Relationship): Promise<[any, any]> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	let match: RecordShape;

	try {
		match = await session.run(
			`MATCH (n1:${relationship.node1.nodeType} { ${relationship.node1.getIdString('n1')} }), (n2:${
				relationship.node2.nodeType
			} { ${relationship.node2.getIdString('n2')} }) CREATE (n1)-[:${relationship.type}]->(n2) RETURN n1, n2`,
			relationship.getRelationshipParams('n1', 'n2')
		);
	} catch (error) {
		throw new InternalError(Errors.COULD_NOT_CREATE_RELATIONSHIP, { cause: error });
	} finally {
		await session.close();
		await driver.close();
	}

	if (match.summary.counters._stats.relationshipsCreated !== 1) {
		throw new InternalError(Errors.NO_RELATIONSHIP_CREATED);
	}

	return [match.records[0].get('n1').properties, match.records[0].get('n2').properties];
}

export async function getRelationshipsToNode(
	node: Node,
	secondNodeType: NodeType,
	relationshipType: RelationshipType,
	undirectedMatch: boolean = false
): Promise<any[]> {
	const driver: Driver = await connect();
	const session: Session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	let match: RecordShape;

	try {
		match = await session.run(
			`MATCH (n1:${node.nodeType} { ${node.getIdString()} })-[:${relationshipType}]-${
				undirectedMatch ? '' : '>'
			}(n2:${secondNodeType}) RETURN n2`,
			node.getIdParams()
		);
	} catch (error) {
		throw new InternalError(Errors.COULD_NOT_GET_RELATIONSHIPS, { cause: error });
	} finally {
		await session.close();
		await driver.close();
	}

	return match.records.map((record: Record) => record.get('n2').properties);
}
