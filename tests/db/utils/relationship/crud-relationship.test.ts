import neo4j, { Driver, Session } from 'neo4j-driver';
import { Node, NodeType, Relationship, RelationshipType } from '../../../../src/_helpers/nodes';
import { createNode } from '../../../../src/db/utils/crud';
import { createRelationship, getRelationshipsToNode, Errors } from '../../../../src/db/utils/relationship/crud-relationship';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('CRUD Relationship', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a relationship', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);

		await createNode(n1.nodeType, [n1.getIdString()], n1.getIdParams());
		await createNode(n2.nodeType, [n2.getIdString()], n2.getIdParams());

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		const [matchedn1, matchedn2] = await createRelationship(r);

		expect(matchedn1.name).toEqual(n1.idValue);
		expect(matchedn2.name).toEqual(n2.idValue);
	});

	it('should get relationships', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);

		await createNode(n1.nodeType, [n1.getIdString()], n1.getIdParams());
		await createNode(n2.nodeType, [n2.getIdString()], n2.getIdParams());

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		await createRelationship(r);

		const relationships = await getRelationshipsToNode(n1, n2.nodeType, r.type);
		expect(relationships).toHaveLength(1);
		expect(relationships[0].name).toEqual(n2.idValue);
	});

	it('should return an undirected match', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);

		await createNode(n1.nodeType, [n1.getIdString()], n1.getIdParams());
		await createNode(n2.nodeType, [n2.getIdString()], n2.getIdParams());

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		await createRelationship(r);

		const relationships = await getRelationshipsToNode(n2, n1.nodeType, r.type, true);
		expect(relationships).toHaveLength(1);
		expect(relationships[0].name).toEqual(n1.idValue);
	});

	it('should throw an error if no relationship was created', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);

		const r: Relationship = new Relationship(n1, n2, RelationshipType.PAIRS_WITH);
		await expect(createRelationship(r)).rejects.toThrow(Errors.NO_RELATIONSHIP_CREATED);
	});

	it('should throw an error if there was an internal issue when creating a relationship', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);

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

	it('should throw an error if there was an internal issue when getting relationships', async () => {
		const n1: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);
		const n2: Node = new Node(NodeType.FLAVOR, 'name', (global as any).uniqueNounsIterator.next().value);
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

	// it('should delete a relationship', async () => {
	//     // Test implementation
	// });
});
