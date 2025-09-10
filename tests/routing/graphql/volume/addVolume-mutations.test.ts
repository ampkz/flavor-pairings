import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

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
		jest.spyOn(crudVolume, 'addFlavorVolume').mockResolvedValue({ name: volumeName });

		const validateSessionTokenSpy = jest.spyOn(sessions, 'validateSessionToken');
		validateSessionTokenSpy.mockResolvedValueOnce({
			session: { id: '', expiresAt: new Date(), userID: '', host: '', userAgent: '' },
			user: new User({ email: faker.internet.email(), auth: Auth.ADMIN }),
		});

		const token = sessions.generateSessionToken();

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddVolume($input: FlavorVolumeInput!) {
                    addFlavorVolume(input: $input) {
                        success
						volume {
							name
						}
                    }
                }
            `,
				variables: { input: { flavor: flavorName, volume: volumeName } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.addFlavorVolume).toEqual({ success: true, volume: { name: volumeName } });
	});

	it('should return unsuccessful if no volume was added', async () => {
		const flavorName = faker.word.noun();
		const volumeName = faker.word.noun();
		jest.spyOn(crudVolume, 'addFlavorVolume').mockResolvedValue(null);
		const validateSessionTokenSpy = jest.spyOn(sessions, 'validateSessionToken');
		validateSessionTokenSpy.mockResolvedValueOnce({
			session: { id: '', expiresAt: new Date(), userID: '', host: '', userAgent: '' },
			user: new User({ email: faker.internet.email(), auth: Auth.ADMIN }),
		});

		const token = sessions.generateSessionToken();
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddVolume($input: FlavorVolumeInput!) {
                    addFlavorVolume(input: $input) {
                        success
                        volume {
                            name
                        }
                    }
                }
            `,
				variables: { input: { flavor: flavorName, volume: volumeName } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.addFlavorVolume).toEqual({ success: false, volume: { name: volumeName } });
	});

	it('should throw an error if the user is not authenticated', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddVolume($input: FlavorVolumeInput!) {
                    addFlavorVolume(input: $input) {
                        success
						volume {
							name
						}
                    }
                }
            `,
				variables: { input: { flavor: 'flavorName', volume: 'volumeName' } },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was an issue with the server', async () => {
		jest.spyOn(crudVolume, 'addFlavorVolume').mockRejectedValue(new Error('Server error'));
		const validateSessionTokenSpy = jest.spyOn(sessions, 'validateSessionToken');
		validateSessionTokenSpy.mockResolvedValueOnce({
			session: { id: '', expiresAt: new Date(), userID: '', host: '', userAgent: '' },
			user: new User({ email: faker.internet.email(), auth: Auth.ADMIN }),
		});

		const token = sessions.generateSessionToken();
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddVolume($input: FlavorVolumeInput!) {
                    addFlavorVolume(input: $input) {
                        success
                        volume {
                            name
                        }
                    }
                }
            `,
				variables: { input: { flavor: 'flavorName', volume: 'volumeName' } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(500);

		expect(response.body.errors).toBeDefined();
	});
});
