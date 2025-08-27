import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTaste from '../../../../src/db/pairings/crud-taste';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('CreateTaste mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a taste', async () => {
		const tasteName = faker.word.noun();
		jest.spyOn(crudTaste, 'createTaste').mockResolvedValue({ name: tasteName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateTaste($name: ID!) {
                    createTaste(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: tasteName },
			})
			.expect(200);

		expect(response.body.data.createTaste).toEqual({ name: tasteName });
	});

	it('should throw an error with a bad input', async () => {
		const tasteName = faker.word.noun();
		jest.spyOn(crudTaste, 'createTaste').mockResolvedValue({ name: tasteName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateTaste($name: ID!) {
                    createTaste(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: null },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudTaste, 'createTaste').mockRejectedValue(new InternalError('Server error'));

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateTaste($name: ID!) {
                    createTaste(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'test' },
			})
			.expect(200);

		expect(response.body.errors).toBeDefined();
	});
});
