import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTechnique from '../../../../src/db/pairings/crud-technique';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { Neo4jError } from 'neo4j-driver';

describe('CreateTechnique mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a technique', async () => {
		const techniqueName = faker.word.noun();
		jest.spyOn(crudTechnique, 'createTechnique').mockResolvedValue({ name: techniqueName });

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
                mutation CreateTechnique($name: ID!) {
                    createTechnique(name: $name) {
                        success
						technique {
							name
						}
                    }
                }
            `,
				variables: { name: techniqueName },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.createTechnique).toEqual({ success: true, technique: { name: techniqueName } });
	});

	it('should throw an error with a bad input', async () => {
		const techniqueName = faker.word.noun();
		jest.spyOn(crudTechnique, 'createTechnique').mockResolvedValue({ name: techniqueName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateTechnique($name: ID!) {
                    createTechnique(name: $name) {
                        success
                        technique {
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
		jest.spyOn(crudTechnique, 'createTechnique').mockRejectedValue(new InternalError('Server error'));
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
                mutation CreateTechnique($name: ID!) {
                    createTechnique(name: $name) {
                        success
                        technique {
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

	it('should return unsuccessful if technique already exists', async () => {
		jest.spyOn(crudTechnique, 'createTechnique').mockRejectedValue(
			new InternalError('Server error', {
				cause: new Neo4jError('Technique already exists', 'Neo.ClientError.Schema.ConstraintValidationFailed', '', ''),
			})
		);
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
                mutation CreateTechnique($name: ID!) {
                    createTechnique(name: $name) {
                        success
						message
                        technique {
                            name
                        }
                    }
                }
            `,
				variables: { name: 'test' },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.createTechnique.success).toBe(false);
		expect(response.body.data.createTechnique.technique).toEqual({ name: 'test' });
		expect(response.body.data.createTechnique.message).toBeDefined();
	});

	it('should throw an error if the user is not authenticated', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreateTechnique($name: ID!) {
                    createTechnique(name: $name) {
                        success
                        technique {
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
