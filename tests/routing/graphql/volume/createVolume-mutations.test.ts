import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudVolume from '../../../../src/db/pairings/crud-volume';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

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
                mutation CreateVolume($name: ID!) {
                    createVolume(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: volumeName },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.createVolume).toEqual({ name: volumeName });
	});

	it('should throw an error with a bad input', async () => {
		const volumeName = faker.word.noun();
		jest.spyOn(crudVolume, 'createVolume').mockResolvedValue({ name: volumeName });
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
                mutation CreateVolume($name: ID!) {
                    createVolume(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: null },
			})
			.set('Cookie', [`token=${token}`])
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudVolume, 'createVolume').mockRejectedValue(new InternalError('Server error'));
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
                mutation CreateVolume($name: ID!) {
                    createVolume(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'test' },
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
                mutation CreateVolume($name: ID!) {
                    createVolume(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'test' },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});
});
