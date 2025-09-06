import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudWeight from '../../../../src/db/pairings/crud-weight';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

describe('DeleteWeight mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should delete a weight', async () => {
		const weightName = faker.word.noun();
		jest.spyOn(crudWeight, 'deleteWeight').mockResolvedValue({ name: weightName });

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
                mutation DeleteWeight($name: ID!) {
                    deleteWeight(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: weightName },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.deleteWeight).toEqual({ name: weightName });
	});

	it('should return null if no weight found', async () => {
		jest.spyOn(crudWeight, 'deleteWeight').mockResolvedValue(null);
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
                mutation DeleteWeight($name: ID!) {
                    deleteWeight(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'not_found' },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.deleteWeight).toBeNull();
	});

	it('should throw an error if the user is not authenticated', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation DeleteWeight($name: ID!) {
                    deleteWeight(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: 'test' },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was an issue with the server', async () => {
		jest.spyOn(crudWeight, 'deleteWeight').mockRejectedValue(new Error('Server error'));
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
                mutation DeleteWeight($name: ID!) {
                    deleteWeight(name: $name) {
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
});
