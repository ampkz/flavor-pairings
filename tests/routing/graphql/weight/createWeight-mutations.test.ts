import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudWeight from '../../../../src/db/pairings/crud-weight';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('CreateWeight mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a weight', async () => {
		const weightName = faker.word.noun();
		jest.spyOn(crudWeight, 'createWeight').mockResolvedValue({ name: weightName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateWeight($name: ID!) {
                    createWeight(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: weightName },
			})
			.expect(200);

		expect(response.body.data.createWeight).toEqual({ name: weightName });
	});

	it('should throw an error with a bad input', async () => {
		const weightName = faker.word.noun();
		jest.spyOn(crudWeight, 'createWeight').mockResolvedValue({ name: weightName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateWeight($name: ID!) {
                    createWeight(name: $name) {
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
		jest.spyOn(crudWeight, 'createWeight').mockRejectedValue(new InternalError('Server error'));

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateWeight($name: ID!) {
                    createWeight(name: $name) {
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
