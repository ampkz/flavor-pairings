import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTechnique from '../../../../src/db/pairings/crud-technique';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('CreateTechnique mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a technique', async () => {
		const techniqueName = faker.word.noun();
		jest.spyOn(crudTechnique, 'createTechnique').mockResolvedValue({ name: techniqueName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateTechnique($name: ID!) {
                    createTechnique(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: techniqueName },
			})
			.expect(200);

		expect(response.body.data.createTechnique).toEqual({ name: techniqueName });
	});

	it('should throw an error with a bad input', async () => {
		const techniqueName = faker.word.noun();
		jest.spyOn(crudTechnique, 'createTechnique').mockResolvedValue({ name: techniqueName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateTechnique($name: ID!) {
                    createTechnique(name: $name) {
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
		jest.spyOn(crudTechnique, 'createTechnique').mockRejectedValue(new InternalError('Server error'));

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateTechnique($name: ID!) {
                    createTechnique(name: $name) {
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
