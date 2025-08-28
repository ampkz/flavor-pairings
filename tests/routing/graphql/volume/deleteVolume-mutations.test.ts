import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import { faker } from '@faker-js/faker';

describe('DeleteVolume mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should delete a volume', async () => {
		const volumeName = faker.word.noun();
		jest.spyOn(crudVolume, 'deleteVolume').mockResolvedValue({ name: volumeName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteVolume($name: ID!) {
                    deleteVolume(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: volumeName },
			})
			.expect(200);

		expect(response.body.data.deleteVolume).toEqual({ name: volumeName });
	});

	it('should return null if no volume found', async () => {
		jest.spyOn(crudVolume, 'deleteVolume').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteVolume($name: ID!) {
                    deleteVolume(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'not_found' },
			})
			.expect(200);

		expect(response.body.data.deleteVolume).toBeNull();
	});
});
