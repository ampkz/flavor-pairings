import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTaste from '../../../../src/db/pairings/crud-taste';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('UpdateTaste mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should update a taste', async () => {
		const tasteName = faker.word.noun();
		jest.spyOn(crudTaste, 'updateTaste').mockResolvedValue({ name: 'updated_' + tasteName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateTaste($input: UpdateTasteInput!) {
                    updateTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: tasteName, updatedName: 'updated_' + tasteName } },
			})
			.expect(200);

		expect(response.body.data.updateTaste).toEqual({ name: 'updated_' + tasteName });
	});

	it('should throw an error with a bad input', async () => {
		const tasteName = faker.word.noun();
		jest.spyOn(crudTaste, 'updateTaste').mockResolvedValue({ name: tasteName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateTaste($input: UpdateTasteInput!) {
                    updateTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: null } },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudTaste, 'updateTaste').mockRejectedValue(new InternalError('Server error'));

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateTaste($input: UpdateTasteInput!) {
                    updateTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: 'test', updatedName: 'updated_test' } },
			})
			.expect(200);

		expect(response.body.errors).toBeDefined();
	});
});
