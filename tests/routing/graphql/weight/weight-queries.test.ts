import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudWeight from '../../../../src/db/pairings/crud-weight';
import { faker } from '@faker-js/faker';

describe('Weight Queries', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return a created weight', async () => {
		const weightName = faker.word.noun();
		jest.spyOn(crudWeight, 'getWeight').mockResolvedValue({ name: weightName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetWeight($name: ID!) {
                    weight(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: weightName },
			})
			.expect(200);

		expect(response.body.data.weight).toEqual({ name: weightName });
	});

	it('should return null if no weight exists', async () => {
		jest.spyOn(crudWeight, 'getWeight').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetWeight($name: ID!) {
                    weight(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'test_weight' },
			})
			.expect(200);

		expect(response.body.data.weight).toBeNull();
	});

	test('GetWeight should throw an error if weight name is missing', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetWeight($name: ID!) {
                    weight(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: null },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should return a list of weights', async () => {
		const weights = Array.from({ length: 3 }, () => ({ name: faker.word.noun() }));
		jest.spyOn(crudWeight, 'getWeights').mockResolvedValue(weights);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetWeights {
                    weights {
                        name
                    }
                }
            `,
			})
			.expect(200);

		expect(response.body.data.weights).toEqual(weights);
	});
});
