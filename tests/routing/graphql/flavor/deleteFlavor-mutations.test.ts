import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudFlavor from '../../../../src/db/pairings/crud-flavor';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

describe('DeleteFlavor mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should delete a flavor', async () => {
		const flavorName = faker.word.noun();
		jest.spyOn(crudFlavor, 'deleteFlavor').mockResolvedValue({ name: flavorName });

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
                mutation DeleteFlavor($name: ID!) {
                    deleteFlavor(name: $name) {
                        success
						flavor {
							name
						}
                    }
                }
            `,
				variables: { name: flavorName },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.deleteFlavor).toEqual({ success: true, flavor: { name: flavorName } });
	});

	it('should throw an error with a bad input', async () => {
		const flavorName = faker.word.noun();
		jest.spyOn(crudFlavor, 'deleteFlavor').mockResolvedValue({ name: flavorName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteFlavor($name: ID!) {
                    deleteFlavor(name: $name) {
                        success
                        flavor {
                            name
                        }
                    }
                }
            `,
				variables: { name: null },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudFlavor, 'deleteFlavor').mockRejectedValue(new InternalError('Server error'));
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
                mutation DeleteFlavor($name: ID!) {
                    deleteFlavor(name: $name) {
                        success
                        flavor {
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

	it('should throw an error if the user is not authenticated', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
					mutation DeleteFlavor($name: ID!) {
                    deleteFlavor(name: $name) {
                        success
                        flavor {
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
});
