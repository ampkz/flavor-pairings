import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudFlavor from '../../../../src/db/pairings/crud-flavor';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('DeleteFlavor mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should delete a flavor', async () => {
		const flavorName = faker.word.noun();
		jest.spyOn(crudFlavor, 'deleteFlavor').mockResolvedValue({ name: flavorName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteFlavor($name: ID!) {
                    deleteFlavor(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: flavorName },
			})
			.expect(200);

		expect(response.body.data.deleteFlavor).toEqual({ name: flavorName });
	});

	it('should throw an error with a bad input', async () => {
		const flavorName = faker.word.noun();
		jest.spyOn(crudFlavor, 'deleteFlavor').mockResolvedValue({ name: flavorName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteFlavor($name: ID!) {
                    deleteFlavor(name: $name) {
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
		jest.spyOn(crudFlavor, 'deleteFlavor').mockRejectedValue(new InternalError('Server error'));

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteFlavor($name: ID!) {
                    deleteFlavor(name: $name) {
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
