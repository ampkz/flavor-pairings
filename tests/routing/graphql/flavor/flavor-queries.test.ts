import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudFlavor from '../../../../src/db/pairings/crud-flavor';
import * as crudTaste from '../../../../src/db/pairings/crud-taste';
import * as crudTechnique from '../../../../src/db/pairings/crud-technique';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import * as crudWeight from '../../../../src/db/pairings/crud-weight';
import * as crud from '../../../../src/db/utils/crud';
import { faker } from '@faker-js/faker';

describe('Flavor Queries', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return a created flavor', async () => {
		const flavorName = faker.word.noun();
		jest.spyOn(crudFlavor, 'getFlavor').mockResolvedValue({ name: flavorName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetFlavor($name: ID!) {
                    flavor(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: flavorName },
			})
			.expect(200);

		expect(response.body.data.flavor).toEqual({ name: flavorName });
	});

	it('should return a list of tastes associated with a flavor', async () => {
		const flavorName = faker.word.noun();
		const tasteName = faker.word.noun();
		const taste2Name = faker.word.noun();

		jest.spyOn(crudFlavor, 'getFlavor').mockResolvedValue({ name: flavorName });
		jest.spyOn(crudTaste, 'getFlavorTastes').mockResolvedValue([{ name: tasteName }, { name: taste2Name }]);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetFlavorTastes($name: ID!) {
                    flavor(name: $name) {
                        taste {
                            name
                        }
                    }
                }
            `,
				variables: { name: flavorName },
			})
			.expect(200);

		expect(response.body.data.flavor.taste).toEqual([{ name: tasteName }, { name: taste2Name }]);
	});

	it('should return a list of techniques associated with a flavor', async () => {
		const flavorName = faker.word.noun();
		const techniqueName = faker.word.noun();
		const technique2Name = faker.word.noun();

		jest.spyOn(crudFlavor, 'getFlavor').mockResolvedValue({ name: flavorName });
		jest.spyOn(crudTechnique, 'getFlavorTechniques').mockResolvedValue([{ name: techniqueName }, { name: technique2Name }]);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetFlavorTechniques($name: ID!) {
                    flavor(name: $name) {
                        technique {
                            name
                        }
                    }
                }
            `,
				variables: { name: flavorName },
			})
			.expect(200);

		expect(response.body.data.flavor.technique).toEqual([{ name: techniqueName }, { name: technique2Name }]);
	});

	it('should return a list of volumes associated with a flavor', async () => {
		const flavorName = faker.word.noun();
		const volumeName = faker.word.noun();
		const volume2Name = faker.word.noun();

		jest.spyOn(crudFlavor, 'getFlavor').mockResolvedValue({ name: flavorName });
		jest.spyOn(crudVolume, 'getFlavorVolumes').mockResolvedValue([{ name: volumeName }, { name: volume2Name }]);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetFlavorVolumes($name: ID!) {
                    flavor(name: $name) {
                        volume {
                            name
                        }
                    }
                }
            `,
				variables: { name: flavorName },
			})
			.expect(200);

		expect(response.body.data.flavor.volume).toEqual([{ name: volumeName }, { name: volume2Name }]);
	});

	it('should return a list of weights associated with a flavor', async () => {
		const flavorName = faker.word.noun();
		const weightName = faker.word.noun();
		const weight2Name = faker.word.noun();

		jest.spyOn(crudFlavor, 'getFlavor').mockResolvedValue({ name: flavorName });
		jest.spyOn(crudWeight, 'getFlavorWeights').mockResolvedValue([{ name: weightName }, { name: weight2Name }]);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetFlavorWeights($name: ID!) {
                    flavor(name: $name) {
                        weight {
                            name
                        }
                    }
                }
            `,
				variables: { name: flavorName },
			})
			.expect(200);

		expect(response.body.data.flavor.weight).toEqual([{ name: weightName }, { name: weight2Name }]);
	});

	it('should return null if no flavor exists', async () => {
		const flavorName = faker.word.noun();
		jest.spyOn(crudFlavor, 'getFlavor').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetFlavor($name: ID!) {
                    flavor(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: flavorName },
			})
			.expect(200);

		expect(response.body.data.flavor).toBeNull();
	});

	test('GetFlavor should throw an error if flavor name is missing', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetFlavor($name: ID!) {
                    flavor(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: null },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should return a list of flavors', async () => {
		const flavors = Array.from({ length: 3 }, () => ({ name: faker.word.noun() }));
		jest.spyOn(crud, 'getTotalNodeCountByType').mockResolvedValue(flavors.length);
		jest.spyOn(crudFlavor, 'getFlavors').mockResolvedValue(flavors);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetFlavors {
                    flavors {
                        items {
                            name
                        }
                        totalCount
                    }
                }
            `,
			})
			.expect(200);

		expect(response.body.data.flavors.items).toEqual(flavors);
		expect(response.body.data.flavors.totalCount).toEqual(flavors.length);
	});
});
