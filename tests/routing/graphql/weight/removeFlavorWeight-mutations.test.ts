import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudWeight from '../../../../src/db/pairings/crud-weight';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('RemoveFlavorWeight mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should remove a flavor taste', async () => {
		const weight = faker.word.noun();
		const flavor = faker.word.noun();
		jest.spyOn(crudWeight, 'removeFlavorWeight').mockResolvedValue({ name: weight });

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
                mutation RemoveFlavorWeight($input: FlavorWeightInput!) {
                    removeFlavorWeight(input: $input) {
                        success
						weight { name }
                    }
                }
            `,
				variables: { input: { flavor, weight } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.removeFlavorWeight).toEqual({ success: true, weight: { name: weight } });
	});

	it('should return unsuccessful if no weight was removed', async () => {
		const weight = faker.word.noun();
		const flavor = faker.word.noun();
		jest.spyOn(crudWeight, 'removeFlavorWeight').mockResolvedValue(null);
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
                mutation RemoveFlavorWeight($input: FlavorWeightInput!) {
                    removeFlavorWeight(input: $input) {
                        success
                        weight { name }
                    }
                }
            `,
				variables: { input: { flavor, weight } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.removeFlavorWeight).toEqual({ success: false, weight: { name: weight } });
	});

	it('should throw an error with a bad input', async () => {
		const weight = faker.word.noun();
		jest.spyOn(crudWeight, 'removeFlavorWeight').mockResolvedValue({ name: weight });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation RemoveFlavorTaste($input: FlavorTasteInput!) {
                    removeFlavorTaste(input: $input) {
                        success
						taste { name }
                    }
                }
            `,
				variables: { input: { flavor: null, weight } },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudWeight, 'removeFlavorWeight').mockRejectedValue(new InternalError('Server error'));
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
                mutation RemoveFlavorWeight($input: FlavorWeightInput!) {
                    removeFlavorWeight(input: $input) {
                        success
						weight { name }
                    }
                }
            `,
				variables: { input: { flavor: 'test1', weight: 'test2' } },
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
               mutation RemoveFlavorWeight($input: FlavorWeightInput!) {
                    removeFlavorWeight(input: $input) {
                        success
						weight { name }
                    }
                }
            `,
				variables: { input: { flavor: 'test1', weight: 'test2' } },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});
});
