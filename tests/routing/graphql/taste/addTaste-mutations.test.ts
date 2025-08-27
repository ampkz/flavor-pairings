import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTaste from '../../../../src/db/pairings/crud-taste';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('AddTaste mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should add a taste', async () => {
		const taste = faker.word.noun();
		const flavor = faker.word.noun();
		jest.spyOn(crudTaste, 'addTaste').mockResolvedValue({ name: taste });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddTaste($input: AddTasteInput!) {
                    addTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor, taste } },
			})
			.expect(200);

		expect(response.body.data.addTaste).toEqual({ name: taste });
	});

	it('should throw an error with a bad input', async () => {
		const taste = faker.word.noun();
		jest.spyOn(crudTaste, 'addTaste').mockResolvedValue({ name: taste });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddTaste($input: AddTasteInput!) {
                    addTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: null, taste } },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudTaste, 'addTaste').mockRejectedValue(new InternalError('Server error'));

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddTaste($input: AddTasteInput!) {
                    addTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: 'test1', taste: 'test2' } },
			})
			.expect(200);

		expect(response.body.errors).toBeDefined();
	});
});
