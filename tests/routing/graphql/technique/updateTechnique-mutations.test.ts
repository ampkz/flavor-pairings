import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTechnique from '../../../../src/db/pairings/crud-technique';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

describe('UpdateTechnique mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should update a technique', async () => {
		const techniqueName = faker.word.noun();
		jest.spyOn(crudTechnique, 'updateTechnique').mockResolvedValue({ name: 'updated_' + techniqueName });

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
                mutation UpdateTechnique($input: UpdateTechniqueInput!) {
                    updateTechnique(input: $input) {
                        success
						technique {
							name
						}
                    }
                }
            `,
				variables: { input: { name: techniqueName, updatedName: 'updated_' + techniqueName } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.updateTechnique).toEqual({ success: true, technique: { name: 'updated_' + techniqueName } });
	});

	it('should return unsuccessful if no technique was updated', async () => {
		jest.spyOn(crudTechnique, 'updateTechnique').mockResolvedValue(null);
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
                mutation UpdateTechnique($input: UpdateTechniqueInput!) {
                    updateTechnique(input: $input) {
                        success
                        technique {
                            name
                        }
                    }
                }
            `,
				variables: { input: { name: 'not_found', updatedName: 'updated_name' } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.updateTechnique).toEqual({ success: false, technique: { name: 'updated_name' } });
	});

	it('should throw an error if the user is not authorized', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateTechnique($input: UpdateTechniqueInput!) {
                    updateTechnique(input: $input) {
                        success
                        technique {
                            name
                        }
                    }
                }
            `,
				variables: { input: { name: 'not_found', updatedName: 'updated_name' } },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was an issue with the server', async () => {
		jest.spyOn(crudTechnique, 'updateTechnique').mockRejectedValue(new Error('Server error'));

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
                mutation UpdateTechnique($input: UpdateTechniqueInput!) {
                    updateTechnique(input: $input) {
                        success
                        technique {
                            name
                        }
                    }
                }
            `,
				variables: { input: { name: 'not_found', updatedName: 'updated_name' } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(500);

		expect(response.body.errors).toBeDefined();
	});
});
