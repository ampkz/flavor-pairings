import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudFlavor from '../../../../src/db/pairings/crud-flavor';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

describe('UpdateFlavor mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should update a flavor', async () => {
		const flavorName = faker.word.noun();
		jest.spyOn(crudFlavor, 'updateFlavor').mockResolvedValue({ name: 'updated_' + flavorName });

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
                mutation UpdateFlavor($input: UpdateFlavorInput!) {
                    updateFlavor(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: flavorName, updatedName: 'updated_' + flavorName } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.updateFlavor).toEqual({ name: 'updated_' + flavorName });
	});

	it('should throw an error with a bad input', async () => {
		const flavorName = faker.word.noun();
		jest.spyOn(crudFlavor, 'updateFlavor').mockResolvedValue({ name: flavorName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateFlavor($input: UpdateFlavorInput!) {
                    updateFlavor(input: $input) {
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
		jest.spyOn(crudFlavor, 'updateFlavor').mockRejectedValue(new InternalError('Server error'));

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateFlavor($input: UpdateFlavorInput!) {
                    updateFlavor(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: 'test', updatedName: 'updated_test' } },
			})
			.expect(200);

		expect(response.body.errors).toBeDefined();
	});
});
