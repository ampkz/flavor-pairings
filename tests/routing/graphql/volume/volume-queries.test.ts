import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import { faker } from '@faker-js/faker';

describe('Volume Queries', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return a created volume', async () => {
		const volumeName = faker.word.noun();
		jest.spyOn(crudVolume, 'getVolume').mockResolvedValue({ name: volumeName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetVolume($name: ID!) {
                    volume(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: volumeName },
			})
			.expect(200);

		expect(response.body.data.volume).toEqual({ name: volumeName });
	});

	it('should return null if no volume exists', async () => {
		jest.spyOn(crudVolume, 'getVolume').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetVolume($name: ID!) {
                    volume(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'test_volume' },
			})
			.expect(200);

		expect(response.body.data.volume).toBeNull();
	});

	test('GetVolume should throw an error if volume name is missing', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetVolume($name: ID!) {
                    volume(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: null },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should return a list of volumes', async () => {
		const volumes = Array.from({ length: 3 }, () => ({ name: faker.word.noun() }));
		jest.spyOn(crudVolume, 'getVolumes').mockResolvedValue(volumes);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query GetVolumes {
                    volumes {
                        name
                    }
                }
            `,
			})
			.expect(200);

		expect(response.body.data.volumes).toEqual(volumes);
	});
});
