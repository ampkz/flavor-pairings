import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('CreateVolume mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a volume', async () => {
		const volumeName = faker.word.noun();
		jest.spyOn(crudVolume, 'createVolume').mockResolvedValue({ name: volumeName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateVolume($name: ID!) {
                    createVolume(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: volumeName },
			})
			.expect(200);

		expect(response.body.data.createVolume).toEqual({ name: volumeName });
	});

	it('should throw an error with a bad input', async () => {
		const volumeName = faker.word.noun();
		jest.spyOn(crudVolume, 'createVolume').mockResolvedValue({ name: volumeName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateVolume($name: ID!) {
                    createVolume(name: $name) {
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
		jest.spyOn(crudVolume, 'createVolume').mockRejectedValue(new InternalError('Server error'));

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateVolume($name: ID!) {
                    createVolume(name: $name) {
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
