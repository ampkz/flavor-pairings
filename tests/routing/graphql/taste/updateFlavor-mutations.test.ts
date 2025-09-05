import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTaste from '../../../../src/db/pairings/crud-taste';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('UpdateTaste mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should update a taste', async () => {
		const tasteName = faker.word.noun();
		jest.spyOn(crudTaste, 'updateTaste').mockResolvedValue({ name: 'updated_' + tasteName });

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
                mutation UpdateTaste($input: UpdateTasteInput!) {
                    updateTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: tasteName, updatedName: 'updated_' + tasteName } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.updateTaste).toEqual({ name: 'updated_' + tasteName });
	});

	it('should throw an error with a bad input', async () => {
		const tasteName = faker.word.noun();
		jest.spyOn(crudTaste, 'updateTaste').mockResolvedValue({ name: tasteName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateTaste($input: UpdateTasteInput!) {
                    updateTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: null } },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudTaste, 'updateTaste').mockRejectedValue(new InternalError('Server error'));
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
                mutation UpdateTaste($input: UpdateTasteInput!) {
                    updateTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: 'test', updatedName: 'updated_test' } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.errors).toBeDefined();
	});
});
