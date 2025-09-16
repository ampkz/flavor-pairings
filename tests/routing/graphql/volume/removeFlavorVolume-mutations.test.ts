import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('RemoveFlavorVolume mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should remove a flavor volume', async () => {
		const volume = faker.word.noun();
		const flavor = faker.word.noun();
		jest.spyOn(crudVolume, 'removeFlavorVolume').mockResolvedValue({ name: volume });

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
                mutation RemoveFlavorVolume($input: FlavorVolumeInput!) {
                    removeFlavorVolume(input: $input) {
                        success
						volume { name }
                    }
                }
            `,
				variables: { input: { flavor, volume } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.removeFlavorVolume).toEqual({ success: true, volume: { name: volume } });
	});

	it('should return unsuccessful if no volume was removed', async () => {
		const volume = faker.word.noun();
		const flavor = faker.word.noun();
		jest.spyOn(crudVolume, 'removeFlavorVolume').mockResolvedValue(null);
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
                mutation RemoveFlavorVolume($input: FlavorVolumeInput!) {
                    removeFlavorVolume(input: $input) {
                        success
                        volume { name }
                    }
                }
            `,
				variables: { input: { flavor, volume } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.removeFlavorVolume).toEqual({ success: false, volume: { name: volume } });
	});

	it('should throw an error with a bad input', async () => {
		const volume = faker.word.noun();
		jest.spyOn(crudVolume, 'removeFlavorVolume').mockResolvedValue({ name: volume });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation RemoveFlavorVolume($input: FlavorVolumeInput!) {
                    removeFlavorVolume(input: $input) {
                        success
						volume { name }
                    }
                }
            `,
				variables: { input: { flavor: null, volume } },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudVolume, 'removeFlavorVolume').mockRejectedValue(new InternalError('Server error'));
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
                mutation RemoveFlavorVolume($input: FlavorVolumeInput!) {
                    removeFlavorVolume(input: $input) {
                        success
						volume { name }
                    }
                }
            `,
				variables: { input: { flavor: 'test1', volume: 'test2' } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(500);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if the user is not authenticated', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
               mutation RemoveFlavorVolume($input: FlavorVolumeInput!) {
                    removeFlavorVolume(input: $input) {
                        success
						volume { name }
                    }
                }
            `,
				variables: { input: { flavor: 'test1', volume: 'test2' } },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});
});
