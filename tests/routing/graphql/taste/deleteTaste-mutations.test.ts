import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTaste from '../../../../src/db/pairings/crud-taste';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('DeleteTaste mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should delete a taste', async () => {
		const tasteName = faker.word.noun();
		jest.spyOn(crudTaste, 'deleteTaste').mockResolvedValue({ name: tasteName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteTaste($name: ID!) {
                    deleteTaste(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: tasteName },
			})
			.expect(200);

		expect(response.body.data.deleteTaste).toEqual({ name: tasteName });
	});

	it('should throw an error with a bad input', async () => {
		const tasteName = faker.word.noun();
		jest.spyOn(crudTaste, 'deleteTaste').mockResolvedValue({ name: tasteName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteTaste($name: ID!) {
                    deleteTaste(name: $name) {
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
		jest.spyOn(crudTaste, 'deleteTaste').mockRejectedValue(new InternalError('Server error'));

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteTaste($name: ID!) {
                    deleteTaste(name: $name) {
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
