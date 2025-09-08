import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudFlavor from '../../../../src/db/pairings/crud-flavor';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

describe('CreateFlavor mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a flavor', async () => {
		const flavorName = faker.word.noun();
		jest.spyOn(crudFlavor, 'createFlavor').mockResolvedValue({ name: flavorName });

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
                mutation CreateFlavor($input: CreateFlavorInput!) {
                    createFlavor(input: $input) {
                        success
                        flavor {
                            name
                        }
                    }
                }
            `,
				variables: { input: { name: flavorName } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.createFlavor).toEqual({ success: true, flavor: { name: flavorName } });
	});

	it('should throw an error with a bad input', async () => {
		const flavorName = faker.word.noun();
		jest.spyOn(crudFlavor, 'createFlavor').mockResolvedValue({ name: flavorName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateFlavor($input: CreateFlavorInput!) {
                    createFlavor(input: $input) {
                        success
                        flavor {
                            name
                        }
                    }
                }
            `,
				variables: { input: { name: null } },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudFlavor, 'createFlavor').mockRejectedValue(new InternalError('Server error'));
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
                mutation CreateFlavor($input: CreateFlavorInput!) {
                    createFlavor(input: $input) {
                        success
                        flavor {
                            name
                        }
                    }
                }
            `,
				variables: { input: { name: 'test' } },
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
					mutation CreateFlavor($input: CreateFlavorInput!) {
                        createFlavor(input: $input) {
                            success
                            flavor {
                                name
                            }
                        }
                    }
				`,
				variables: { input: { name: 'test' } },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});
});
