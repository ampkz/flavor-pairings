import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTaste from '../../../../src/db/pairings/crud-taste';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('AddTaste mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should add a taste', async () => {
		const taste = faker.word.noun();
		const flavor = faker.word.noun();
		jest.spyOn(crudTaste, 'addTaste').mockResolvedValue({ name: taste });

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
                mutation AddTaste($input: AddTasteInput!) {
                    addTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor, taste } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.addTaste).toEqual({ name: taste });
	});

	it('should throw an error with a bad input', async () => {
		const taste = faker.word.noun();
		jest.spyOn(crudTaste, 'addTaste').mockResolvedValue({ name: taste });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddTaste($input: AddTasteInput!) {
                    addTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: null, taste } },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudTaste, 'addTaste').mockRejectedValue(new InternalError('Server error'));
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
                mutation AddTaste($input: AddTasteInput!) {
                    addTaste(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: 'test1', taste: 'test2' } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.errors).toBeDefined();
	});
});
