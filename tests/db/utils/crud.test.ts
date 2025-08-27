import {
	createNode,
	Errors as CRUDErrors,
	deleteNode,
	getNode,
	getNodes,
	getTotalNodeCountByType,
	removeProperties,
	updateNode,
} from '../../../src/db/utils/crud';
import { NodeType } from '../../../src/_helpers/nodes';
import { faker } from '@faker-js/faker';
import neo4j, { Driver, Neo4jError, Record, Session } from 'neo4j-driver';
import { isSortedAlphabetically } from '../../../src/_helpers/array';

describe('Node CRUD Operations', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a node', async () => {
		const flavor = (global as any).getNextNoun();
		const result = await createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor });
		expect(result).toHaveProperty('name', flavor);
	});

	it('should get a node', async () => {
		const flavor = (global as any).getNextNoun();
		await createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor });
		const result = await getNode(NodeType.FLAVOR, ['name: $name'], { name: flavor });
		expect(result).toHaveProperty('name', flavor);
	});

	it('should get an array of created nodes', async () => {
		const flavors = Array.from({ length: 5 }, () => (global as any).getNextNoun());
		await Promise.all(flavors.map(flavor => createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor })));
		const result = await getNodes(NodeType.FLAVOR);
		flavors.forEach(flavor => {
			expect(result).toContainEqual(expect.objectContaining({ name: flavor }));
		});
	});

	it('should alphabetically order an array of created nodes', async () => {
		const flavors = Array.from({ length: 5 }, () => (global as any).getNextNoun('goa_'));
		await Promise.all(flavors.map(flavor => createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor })));
		const result = await getNodes(NodeType.FLAVOR, 'n.name ASC');
		expect(isSortedAlphabetically(result)).toBe(true);
	});

	test('getNodes should return a list of limited nodes', async () => {
		const flavors = Array.from({ length: 5 }, () => (global as any).getNextNoun('gnl_'));
		await Promise.all(flavors.map(flavor => createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor })));
		const result = await getNodes(NodeType.FLAVOR, 'n.name ASC', 3);
		expect(result.length).toEqual(3);
	});

	test('getNodes should return a list of nodes matching a where clause', async () => {
		const flavors = Array.from({ length: 5 }, () => (global as any).getNextNoun('gmw_'));
		await Promise.all(flavors.map(flavor => createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor })));
		const result = await getNodes(NodeType.FLAVOR, 'n.name ASC', 5, 'n.name STARTS WITH "gmw_"');
		expect(result.length).toEqual(5);
		flavors.forEach(flavor => {
			expect(result).toContainEqual(expect.objectContaining({ name: flavor }));
		});
	});

	it('should return a total number of created nodes by nodeType', async () => {
		const flavor = (global as any).getNextNoun('tn_');
		await createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor });
		const result = await getTotalNodeCountByType(NodeType.FLAVOR);
		expect(result).toBeGreaterThanOrEqual(1);
	});

	it('should update a node', async () => {
		const flavor = (global as any).getNextNoun('un_');
		const updatedFlavor = (global as any).getNextNoun('un_');
		await createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor });
		const result = await updateNode(NodeType.FLAVOR, 'f', ['name: $name'], ['f.name = $updatedName'], {
			name: flavor,
			updatedName: updatedFlavor,
		});
		expect(result).toHaveProperty('name', updatedFlavor);
	});

	it(`should return null if no node was updated but the query was successful`, async () => {
		const result = await updateNode(NodeType.FLAVOR, 'f', ['name: $name'], ['f.name = $updatedName'], {
			name: 'non_existent_node',
			updatedName: 'updatedFlavor',
		});
		expect(result).toBeNull();
	});

	it('should delete a node', async () => {
		const flavor = (global as any).getNextNoun('dn_');
		await createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor });
		const result = await deleteNode(NodeType.FLAVOR, ['name: $name'], { name: flavor });
		expect(result).toHaveProperty('name', flavor);
	});

	it('should remove properties from a node', async () => {
		const flavor = (global as any).getNextNoun();
		await createNode(NodeType.FLAVOR, ['name: $name', 'propToRemove: $propToRemove'], { name: flavor, propToRemove: 'removeMe' });
		const result = await removeProperties(NodeType.FLAVOR, 'f', ['name: $name'], ['f.propToRemove'], {
			name: flavor,
		});
		expect(result).toHaveProperty('name', flavor);
		expect(result).not.toHaveProperty('propToRemove');
	});

	it('should return null if no properties were removed from a node', async () => {
		const flavor = (global as any).getNextNoun();
		const result = await removeProperties(NodeType.FLAVOR, 'f', ['name: $name'], ['f.propToRemove'], {
			name: flavor,
		});
		expect(result).toBeNull();
	});

	it(`should throw an error if the query was successful but still didn't create a node`, async () => {
		const driverMock = {
			session: jest.fn().mockReturnValue({
				run: jest.fn().mockResolvedValueOnce({ summary: { counters: { _stats: { nodesCreated: 0 } } } }),
				close: jest.fn(),
			} as unknown as Session),
			close: jest.fn(),
			getServerInfo: jest.fn(),
		} as unknown as Driver;

		const driverSpy = jest.spyOn(neo4j, 'driver');
		driverSpy.mockReturnValueOnce(driverMock);

		await expect(createNode(NodeType.FLAVOR, ['name: $name'], { name: faker.word.noun() })).rejects.toThrow(CRUDErrors.CANNOT_CREATE_NODE);
	});

	it(`should throw an error if there was an issue with the query when getting a node`, async () => {
		const driverMock = {
			session: jest.fn().mockReturnValue({
				run: jest.fn().mockRejectedValue(new Neo4jError('', '', '', '')),
				close: jest.fn(),
			} as unknown as Session),
			close: jest.fn(),
			getServerInfo: jest.fn(),
		} as unknown as Driver;

		const driverSpy = jest.spyOn(neo4j, 'driver');
		driverSpy.mockReturnValueOnce(driverMock);

		await expect(getNode(NodeType.FLAVOR, ['name: $name'], { name: faker.word.noun() })).rejects.toThrow(CRUDErrors.CANNOT_MATCH_NODE);
	});

	it(`should throw an error if there was an issue with getting total nodes`, async () => {
		const driverMock = {
			session: jest.fn().mockReturnValue({
				run: jest.fn().mockRejectedValue(new Neo4jError('', '', '', '')),
				close: jest.fn(),
			} as unknown as Session),
			close: jest.fn(),
			getServerInfo: jest.fn(),
		} as unknown as Driver;

		const driverSpy = jest.spyOn(neo4j, 'driver');
		driverSpy.mockReturnValueOnce(driverMock);

		await expect(getTotalNodeCountByType(NodeType.FLAVOR)).rejects.toThrow(CRUDErrors.CANNOT_GET_TOTAL_NODES);
	});

	it(`should throw an error if there was an issue deleting the node`, async () => {
		const mockRecord = {
			get: (key: any) => {
				if (key === 'id') {
					return { low: 1, high: 0 }; // Neo4j integer
				}
				if (key === 'name') {
					return 'Test Node';
				}
				if (key === 'properties') {
					return { name: 'Test Node' };
				}
				return { properties: {} };
			},
			toObject: () => ({
				id: { low: 1, high: 0 },
				name: 'Test Node',
			}),
		} as unknown as Record;

		const mockResult = {
			records: [mockRecord],
		};

		const driverMock = {
			session: jest.fn().mockReturnValue({
				run: jest
					.fn()
					.mockResolvedValueOnce(mockResult)
					.mockResolvedValueOnce({ summary: { counters: { _stats: { nodesDeleted: 0 } } } }),
				close: jest.fn(),
			} as unknown as Session),
			close: jest.fn(),
			getServerInfo: jest.fn(),
		} as unknown as Driver;

		const driverSpy = jest.spyOn(neo4j, 'driver');
		driverSpy.mockReturnValueOnce(driverMock);

		await expect(deleteNode(NodeType.FLAVOR, ['name: $name'], { name: faker.word.noun() })).rejects.toThrow(CRUDErrors.CANNOT_DELETE_NODE);
	});

	it(`should throw an error if there was an issue with the database in deleting the node`, async () => {
		const mockRecord = {
			get: (key: any) => {
				if (key === 'id') {
					return { low: 1, high: 0 }; // Neo4j integer
				}
				if (key === 'name') {
					return 'Test Node';
				}
				if (key === 'properties') {
					return { name: 'Test Node' };
				}
				return { properties: {} };
			},
			toObject: () => ({
				id: { low: 1, high: 0 },
				name: 'Test Node',
			}),
		} as unknown as Record;

		const mockResult = {
			records: [mockRecord],
		};

		const driverMock = {
			session: jest.fn().mockReturnValue({
				run: jest.fn().mockResolvedValueOnce(mockResult).mockRejectedValueOnce(new Neo4jError('', '', '', '')),
				close: jest.fn(),
			} as unknown as Session),
			close: jest.fn(),
			getServerInfo: jest.fn(),
		} as unknown as Driver;

		const driverSpy = jest.spyOn(neo4j, 'driver');
		driverSpy.mockReturnValueOnce(driverMock);

		await expect(deleteNode(NodeType.FLAVOR, ['name: $name'], { name: faker.word.noun() })).rejects.toThrow(CRUDErrors.CANNOT_DELETE_NODE);
	});

	it(`should throw an error if there was an issue with the database in updating the node`, async () => {
		const driverMock = {
			session: jest.fn().mockReturnValue({
				run: jest.fn().mockRejectedValueOnce(new Neo4jError('', '', '', '')),
				close: jest.fn(),
			} as unknown as Session),
			close: jest.fn(),
			getServerInfo: jest.fn(),
		} as unknown as Driver;

		const driverSpy = jest.spyOn(neo4j, 'driver');
		driverSpy.mockReturnValueOnce(driverMock);

		await expect(
			updateNode(NodeType.FLAVOR, 'f', ['name: $name'], ['f.name = $updatedName'], { name: faker.word.noun(), updatedName: faker.word.noun() })
		).rejects.toThrow(CRUDErrors.CANNOT_UPDATE_NODE);
	});

	it(`should throw an error if there was an issue with the query when removing properties from a node`, async () => {
		const driverMock = {
			session: jest.fn().mockReturnValue({
				run: jest.fn().mockRejectedValue(new Neo4jError('', '', '', '')),
				close: jest.fn(),
			} as unknown as Session),
			close: jest.fn(),
			getServerInfo: jest.fn(),
		} as unknown as Driver;

		const driverSpy = jest.spyOn(neo4j, 'driver');
		driverSpy.mockReturnValueOnce(driverMock);

		await expect(
			removeProperties(NodeType.FLAVOR, 'f', ['name: $name'], ['f.propToRemove'], {
				name: faker.word.noun(),
			})
		).rejects.toThrow(CRUDErrors.CANNOT_UPDATE_NODE);
	});
});
