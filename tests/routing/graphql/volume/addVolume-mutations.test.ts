import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import { faker } from '@faker-js/faker';
import { Flavor } from '../../../../src/pairings/flavor';
import { Volume } from '../../../../src/pairings/volume';

describe('AddVolume mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should add a volume to a flavor and return the volume', async () => {
		const flavorName = faker.word.noun();
		const volumeName = faker.word.noun();
		jest.spyOn(crudVolume, 'addVolume').mockResolvedValue({ name: volumeName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddVolume($input: AddVolumeInput!) {
                    addVolume(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: flavorName, volume: volumeName } },
			})
			.expect(200);

		expect(response.body.data.addVolume).toEqual({ name: volumeName });
	});

	it('should return null if addVolume returns null', async () => {
		const flavorName = faker.word.noun();
		const volumeName = faker.word.noun();
		jest.spyOn(crudVolume, 'addVolume').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddVolume($input: AddVolumeInput!) {
                    addVolume(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: flavorName, volume: volumeName } },
			})
			.expect(200);

		expect(response.body.data.addVolume).toBeNull();
	});
});
