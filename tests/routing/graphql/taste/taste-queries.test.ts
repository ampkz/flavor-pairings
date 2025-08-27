import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTaste from '../../../../src/db/pairings/crud-taste';
import { faker } from '@faker-js/faker';

describe('Taste Queries', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return a created taste', async () => {
		const tasteName = faker.word.noun();
		jest.spyOn(crudTaste, 'getTaste').mockResolvedValue({ name: tasteName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetTaste($name: ID!) {
                    taste(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: tasteName },
			})
			.expect(200);

		expect(response.body.data.taste).toEqual({ name: tasteName });
	});

	it('should return null if no taste exists', async () => {
		jest.spyOn(crudTaste, 'getTaste').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetTaste($name: ID!) {
                    taste(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'test_taste' },
			})
			.expect(200);

		expect(response.body.data.taste).toBeNull();
	});

	test('GetTaste should throw an error if taste name is missing', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetTaste($name: ID!) {
                    taste(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: null },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should return a list of tastes', async () => {
		const tastes = Array.from({ length: 3 }, () => ({ name: faker.word.noun() }));
		jest.spyOn(crudTaste, 'getTastes').mockResolvedValue(tastes);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetTastes {
                    tastes {
                        name
                    }
                }
            `,
			})
			.expect(200);

		expect(response.body.data.tastes).toEqual(tastes);
	});
});
