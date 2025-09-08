import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTaste from '../../../../src/db/pairings/crud-taste';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('DeleteTaste mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should delete a taste', async () => {
		const tasteName = faker.word.noun();
		jest.spyOn(crudTaste, 'deleteTaste').mockResolvedValue({ name: tasteName });

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
                mutation DeleteTaste($name: ID!) {
                    deleteTaste(name: $name) {
                        success
						taste {
							name
						}
                    }
                }
            `,
				variables: { name: tasteName },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.deleteTaste).toEqual({ success: true, taste: { name: tasteName } });
	});

	it('should throw an error with a bad input', async () => {
		const tasteName = faker.word.noun();
		jest.spyOn(crudTaste, 'deleteTaste').mockResolvedValue({ name: tasteName });
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
                mutation DeleteTaste($name: ID!) {
                    deleteTaste(name: $name) {
                        success
                        taste {
                            name
                        }
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
		jest.spyOn(crudTaste, 'deleteTaste').mockRejectedValue(new InternalError('Server error'));
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
                mutation DeleteTaste($name: ID!) {
                    deleteTaste(name: $name) {
                        success
                        taste {
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

	it('should throw an error if user is not authenticated', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteTaste($name: ID!) {
                    deleteTaste(name: $name) {
                        success
                        taste {
                            name
                        }
                    }
                }
            `,
				variables: { name: 'not_found' },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});
});
