import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

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
                mutation UpdateVolume($input: UpdateVolumeInput!) {
                    updateVolume(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: volumeName, updatedName: 'updated_' + volumeName } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.updateVolume).toEqual({ name: 'updated_' + volumeName });
	});

	it('should return null if no volume was found to update', async () => {
		jest.spyOn(crudVolume, 'updateVolume').mockResolvedValue(null);
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
                mutation UpdateVolume($input: UpdateVolumeInput!) {
                    updateVolume(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: 'not_found', updatedName: 'updated_name' } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.updateVolume).toBeNull();
	});

	it('should throw an error if there was an issue with the server', async () => {
		jest.spyOn(crudVolume, 'updateVolume').mockRejectedValue(new Error('Server error'));
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
                mutation UpdateVolume($input: UpdateVolumeInput!) {
                    updateVolume(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: 'test', updatedName: 'updated_test' } },
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
                mutation UpdateVolume($input: UpdateVolumeInput!) {
                    updateVolume(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: 'test', updatedName: 'updated_test' } },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});
});
