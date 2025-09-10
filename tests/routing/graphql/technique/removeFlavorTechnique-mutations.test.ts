import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudTechnique from '../../../../src/db/pairings/crud-technique';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('RemoveFlavorTechnique mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should remove a flavor taste', async () => {
		const technique = faker.word.noun();
		const flavor = faker.word.noun();
		jest.spyOn(crudTechnique, 'removeFlavorTechnique').mockResolvedValue({ name: technique });

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
                mutation RemoveFlavorTechnique($input: FlavorTechniqueInput!) {
                    removeFlavorTechnique(input: $input) {
                        success
						technique { name }
                    }
                }
            `,
				variables: { input: { flavor, technique } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.removeFlavorTechnique).toEqual({ success: true, technique: { name: technique } });
	});

	it('should return unsuccessful if no technique was removed', async () => {
		const technique = faker.word.noun();
		const flavor = faker.word.noun();
		jest.spyOn(crudTechnique, 'removeFlavorTechnique').mockResolvedValue(null);
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
                mutation RemoveFlavorTechnique($input: FlavorTechniqueInput!) {
                    removeFlavorTechnique(input: $input) {
                        success
                        technique { name }
                    }
                }
            `,
				variables: { input: { flavor, technique } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.removeFlavorTechnique).toEqual({ success: false, technique: { name: technique } });
	});

	it('should throw an error with a bad input', async () => {
		const technique = faker.word.noun();
		jest.spyOn(crudTechnique, 'removeFlavorTechnique').mockResolvedValue({ name: technique });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation RemoveFlavorTechnique($input: FlavorTechniqueInput!) {
                    removeFlavorTechnique(input: $input) {
                        success
						technique { name }
                    }
                }
            `,
				variables: { input: { flavor: null, technique } },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudTechnique, 'removeFlavorTechnique').mockRejectedValue(new InternalError('Server error'));
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
                mutation RemoveFlavorTechnique($input: FlavorTechniqueInput!) {
                    removeFlavorTechnique(input: $input) {
                        success
						technique { name }
                    }
                }
            `,
				variables: { input: { flavor: 'test1', technique: 'test2' } },
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
               mutation RemoveFlavorTechnique($input: FlavorTechniqueInput!) {
                    removeFlavorTechnique(input: $input) {
                        success
						technique { name }
                    }
                }
            `,
				variables: { input: { flavor: 'test1', technique: 'test2' } },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});
});
