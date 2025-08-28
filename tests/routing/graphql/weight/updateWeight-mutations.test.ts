import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudWeight from '../../../../src/db/pairings/crud-weight';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

describe('UpdateWeight mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should update a weight', async () => {
		const weightName = faker.word.noun();
		jest.spyOn(crudWeight, 'updateWeight').mockResolvedValue({ name: 'updated_' + weightName });

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
                mutation UpdateWeight($input: UpdateWeightInput!) {
                    updateWeight(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: weightName, updatedName: 'updated_' + weightName } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.updateWeight).toEqual({ name: 'updated_' + weightName });
	});

	it('should return null if no weight was found to update', async () => {
		jest.spyOn(crudWeight, 'updateWeight').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation UpdateWeight($input: UpdateWeightInput!) {
                    updateWeight(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { name: 'not_found', updatedName: 'updated_name' } },
			})
			.expect(200);

		expect(response.body.data.updateWeight).toBeNull();
	});
});
