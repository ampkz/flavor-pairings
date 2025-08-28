import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTechnique from '../../../../src/db/pairings/crud-technique';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

describe('AddTechnique mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should add a technique to a flavor and return the technique', async () => {
		const flavorName = faker.word.noun();
		const techniqueName = faker.word.noun();
		jest.spyOn(crudTechnique, 'addTechnique').mockResolvedValue({ name: techniqueName });

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
                mutation AddTechnique($input: AddTechniqueInput!) {
                    addTechnique(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: flavorName, technique: techniqueName } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.addTechnique).toEqual({ name: techniqueName });
	});

	it('should return null if addTechnique returns null', async () => {
		const flavorName = faker.word.noun();
		const techniqueName = faker.word.noun();
		jest.spyOn(crudTechnique, 'addTechnique').mockResolvedValue(null);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation AddTechnique($input: AddTechniqueInput!) {
                    addTechnique(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor: flavorName, technique: techniqueName } },
			})
			.expect(200);

		expect(response.body.data.addTechnique).toBeNull();
	});
});
