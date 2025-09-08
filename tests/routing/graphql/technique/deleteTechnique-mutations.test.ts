import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTechnique from '../../../../src/db/pairings/crud-technique';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

describe('DeleteTechnique mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should delete a technique', async () => {
		const techniqueName = faker.word.noun();
		jest.spyOn(crudTechnique, 'deleteTechnique').mockResolvedValue({ name: techniqueName });

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
                mutation DeleteTechnique($name: ID!) {
                    deleteTechnique(name: $name) {
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

		expect(response.body.data.deleteTechnique).toEqual({ success: true, technique: { name: techniqueName } });
	});

	it('should return unsuccessful if no technique was deleted', async () => {
		jest.spyOn(crudTechnique, 'deleteTechnique').mockResolvedValue(null);
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
                mutation DeleteTechnique($name: ID!) {
                    deleteTechnique(name: $name) {
                        success
                        technique {
                            name
                        }
                    }
                }
            `,
				variables: { name: 'not_found' },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.deleteTechnique).toEqual({ success: false, technique: { name: 'not_found' } });
	});

	it('should throw an error if there was an issue with the server', async () => {
		jest.spyOn(crudTechnique, 'deleteTechnique').mockRejectedValue(new Error('Server error'));

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
                mutation DeleteTechnique($name: ID!) {
                    deleteTechnique(name: $name) {
                        success
                        technique {
                            name
                        }
                    }
                }
            `,
				variables: { name: 'not_found' },
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
                mutation DeleteTechnique($name: ID!) {
                    deleteTechnique(name: $name) {
                        success
                        technique {
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
