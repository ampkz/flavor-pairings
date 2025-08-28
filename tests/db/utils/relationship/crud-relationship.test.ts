import neo4j, { Driver, Session } from 'neo4j-driver';
import { Node, NodeType, Relationship, RelationshipType } from '../../../../src/_helpers/nodes';
import { createNode, Errors as CRUDErrors } from '../../../../src/db/utils/crud';
import {
	createRelationship,
	getRelationshipsToNode,
	Errors,
	deleteRelationship,
	getTotalRelationshipsToNodes,
} from '../../../../src/db/utils/relationship/crud-relationship';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('CRUD Relationship', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a relationship', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));

		await createNode(n1.nodeType, [n1.getIdString()], n1.getIdParams());
		await createNode(n2.nodeType, [n2.getIdString()], n2.getIdParams());

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		const [matchedn1, matchedn2, matchedR] = await createRelationship(r);

		expect(matchedn1.name).toEqual(n1.idValue);
		expect(matchedn2.name).toEqual(n2.idValue);
		expect(matchedR.type).toEqual(r.type);
	});

	it('should get relationships', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('gr_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('gr_'));

		await createNode(n1.nodeType, [n1.getIdString()], n1.getIdParams());
		await createNode(n2.nodeType, [n2.getIdString()], n2.getIdParams());

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		await createRelationship(r);

		const relationships = await getRelationshipsToNode(n1, n2.nodeType, r.type);

		expect(relationships).toHaveLength(1);
		expect(relationships[0][0].name).toEqual(n2.idValue);
	});

	it('should return the total number of relationships to node', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('tr_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('tr_'));

		await createNode(n1.nodeType, [n1.getIdString()], n1.getIdParams());
		await createNode(n2.nodeType, [n2.getIdString()], n2.getIdParams());

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		await createRelationship(r);

		const total = await getTotalRelationshipsToNodes(n1, n2.nodeType, r.type);
		expect(total).toBe(1);
	});

	it('should return the total number of directed relationships to node', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('tr_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('tr_'));

		await createNode(n1.nodeType, [n1.getIdString()], n1.getIdParams());
		await createNode(n2.nodeType, [n2.getIdString()], n2.getIdParams());

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		await createRelationship(r);

		const total = await getTotalRelationshipsToNodes(n1, n2.nodeType, r.type, false);
		expect(total).toBe(1);
	});

	it('should return an undirected match', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));

		await createNode(n1.nodeType, [n1.getIdString()], n1.getIdParams());
		await createNode(n2.nodeType, [n2.getIdString()], n2.getIdParams());

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		await createRelationship(r);

		const relationships = await getRelationshipsToNode(n2, n1.nodeType, r.type, true);
		expect(relationships).toHaveLength(1);
		expect(relationships[0][0].name).toEqual(n1.idValue);
	});

	it('should return a null tuple if no relationship was created', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		const [matchedn1, matchedn2, matchedR] = await createRelationship(r);
		expect(matchedn1).toBeNull();
		expect(matchedn2).toBeNull();
		expect(matchedR).toBeNull();
	});

	it('should delete a relationship', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));

		await createNode(n1.nodeType, [n1.getIdString()], n1.getIdParams());
		await createNode(n2.nodeType, [n2.getIdString()], n2.getIdParams());

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		const [matchedn1, matchedn2] = await createRelationship(r);

		const [deletedn1, deletedn2] = await deleteRelationship(r);

		expect(deletedn1).toEqual(matchedn1);
		expect(deletedn2).toEqual(matchedn2);
	});

	it('should delete an undirected relationship', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('dur_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('dur_'));

		await createNode(n1.nodeType, [n1.getIdString()], n1.getIdParams());
		await createNode(n2.nodeType, [n2.getIdString()], n2.getIdParams());

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		const [matchedn1, matchedn2] = await createRelationship(r);
		const undirectedR: Relationship = new Relationship(n2, n1, RelationshipType.PAIRS_WITH);
		const [deletedn1, deletedn2] = await deleteRelationship(undirectedR, true);

		expect(deletedn1).toEqual(matchedn2);
		expect(deletedn2).toEqual(matchedn1);
	});

	it('should return a null tuple if no relationship was deleted', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('dur_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('dur_'));
		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);

		const [deletedn1, deletedn2] = await deleteRelationship(r);
		expect(deletedn1).toBeNull();
		expect(deletedn2).toBeNull();
	});

	it('should throw an error if there was an internal issue when creating a relationship', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);

		const driverMock = {
			session: jest.fn().mockReturnValue({
				run: jest.fn().mockRejectedValue(new InternalError(Errors.COULD_NOT_CREATE_RELATIONSHIP)),
				close: jest.fn(),
			} as unknown as Session),
			close: jest.fn(),
			getServerInfo: jest.fn(),
		} as unknown as Driver;

		jest.spyOn(neo4j, 'driver').mockReturnValueOnce(driverMock);

		await expect(createRelationship(r)).rejects.toThrow(Errors.COULD_NOT_CREATE_RELATIONSHIP);
	});

	it('should throw an error if there was an internal issue when getting total number of relationships', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('dur_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('dur_'));

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);

		const driverMock = {
			session: jest.fn().mockReturnValue({
				run: jest.fn().mockRejectedValue(new InternalError(Errors.COULD_NOT_CREATE_RELATIONSHIP)),
				close: jest.fn(),
			} as unknown as Session),
			close: jest.fn(),
			getServerInfo: jest.fn(),
		} as unknown as Driver;

		jest.spyOn(neo4j, 'driver').mockReturnValueOnce(driverMock);

		await expect(getTotalRelationshipsToNodes(n1, n2.nodeType, r.type)).rejects.toThrow(CRUDErrors.CANNOT_GET_TOTAL_NODES);
	});

	it('should throw an error if there was an internal issue when getting relationships', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('dur_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('dur_'));
		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);

		const driverMock = {
			session: jest.fn().mockReturnValue({
				run: jest.fn().mockRejectedValue(new InternalError(Errors.COULD_NOT_GET_RELATIONSHIPS)),
				close: jest.fn(),
			} as unknown as Session),
			close: jest.fn(),
			getServerInfo: jest.fn(),
		} as unknown as Driver;

		jest.spyOn(neo4j, 'driver').mockReturnValueOnce(driverMock);

		await expect(getRelationshipsToNode(n1, n2.nodeType, r.type, true)).rejects.toThrow(Errors.COULD_NOT_GET_RELATIONSHIPS);
	});

	it('should throw an error if there was an internal issue when deleting a relationship', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).getNextNoun('un_'));
		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);

		const driverMock = {
			session: jest.fn().mockReturnValue({
				run: jest.fn().mockRejectedValue(new InternalError(Errors.COULD_NOT_GET_RELATIONSHIPS)),
				close: jest.fn(),
			} as unknown as Session),
			close: jest.fn(),
			getServerInfo: jest.fn(),
		} as unknown as Driver;

		jest.spyOn(neo4j, 'driver').mockReturnValueOnce(driverMock);

		await expect(deleteRelationship(r)).rejects.toThrow(Errors.COULD_NOT_DELETE_RELATIONSHIP);
	});
});
