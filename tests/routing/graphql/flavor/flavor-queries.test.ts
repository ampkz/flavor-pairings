import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudFlavor from '../../../../src/db/pairings/crud-flavor';
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
		jest.spyOn(crudFlavor, 'getFlavors').mockResolvedValue(flavors);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetFlavors {
                    flavors {
                        name
                    }
                }
            `,
			})
			.expect(200);

		expect(response.body.data.flavors).toEqual(flavors);
	});
});
