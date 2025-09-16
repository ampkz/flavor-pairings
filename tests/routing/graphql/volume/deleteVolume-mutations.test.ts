import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

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

		const validateSessionTokenSpy = jest.spyOn(sessions, 'validateSessionToken');
		validateSessionTokenSpy.mockResolvedValueOnce({
			session: { id: '', expiresAt: new Date(), userID: '', clientIp: '', userAgent: '' },
			user: new User({ email: faker.internet.email(), auth: Auth.ADMIN }),
		});

		const token = sessions.generateSessionToken();

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteVolume($name: ID!) {
                    deleteVolume(name: $name) {
                        success
						volume {
							name
						}
                    }
                }
            `,
				variables: { name: volumeName },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.deleteVolume).toEqual({ success: true, volume: { name: volumeName } });
	});

	it('should return unsuccessful if no volume was deleted', async () => {
		jest.spyOn(crudVolume, 'deleteVolume').mockResolvedValue(null);
		const validateSessionTokenSpy = jest.spyOn(sessions, 'validateSessionToken');
		validateSessionTokenSpy.mockResolvedValueOnce({
			session: { id: '', expiresAt: new Date(), userID: '', clientIp: '', userAgent: '' },
			user: new User({ email: faker.internet.email(), auth: Auth.ADMIN }),
		});

		const token = sessions.generateSessionToken();
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteVolume($name: ID!) {
                    deleteVolume(name: $name) {
                        success
                        volume {
                            name
                        }
                    }
                }
            `,
				variables: { name: 'not_found' },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.deleteVolume).toEqual({ success: false, volume: { name: 'not_found' } });
	});

	it('should throw an error if the user is not authenticated', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteVolume($name: ID!) {
                    deleteVolume(name: $name) {
                        success
                        volume {
                            name
                        }
                    }
                }
            `,
				variables: { name: 'test' },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was an issue with the server', async () => {
		jest.spyOn(crudVolume, 'deleteVolume').mockRejectedValue(new Error('Server error'));
		const validateSessionTokenSpy = jest.spyOn(sessions, 'validateSessionToken');
		validateSessionTokenSpy.mockResolvedValueOnce({
			session: { id: '', expiresAt: new Date(), userID: '', clientIp: '', userAgent: '' },
			user: new User({ email: faker.internet.email(), auth: Auth.ADMIN }),
		});

		const token = sessions.generateSessionToken();
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteVolume($name: ID!) {
                    deleteVolume(name: $name) {
                        success
                        volume {
                            name
                        }
                    }
                }
            `,
				variables: { name: 'test' },
			})
			.set('Cookie', [`token=${token}`])
			.expect(500);

		expect(response.body.errors).toBeDefined();
	});
});
