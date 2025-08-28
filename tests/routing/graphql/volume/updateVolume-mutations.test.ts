import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import { faker } from '@faker-js/faker';

describe('UpdateVolume mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should update a volume', async () => {
		const volumeName = faker.word.noun();
		jest.spyOn(crudVolume, 'updateVolume').mockResolvedValue({ name: 'updated_' + volumeName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateVolume($input: UpdateVolumeInput!) {
                    updateVolume(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: volumeName, updatedName: 'updated_' + volumeName } },
			})
			.expect(200);

		expect(response.body.data.updateVolume).toEqual({ name: 'updated_' + volumeName });
	});

	it('should return null if no volume was found to update', async () => {
		jest.spyOn(crudVolume, 'updateVolume').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateVolume($input: UpdateVolumeInput!) {
                    updateVolume(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: 'not_found', updatedName: 'updated_name' } },
			})
			.expect(200);

		expect(response.body.data.updateVolume).toBeNull();
	});
});
