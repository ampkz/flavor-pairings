import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudFlavor from '../../../../src/db/pairings/crud-flavor';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

describe('FlavorTips mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should set tips on a flavor', async () => {
		const flavorName = faker.word.noun();
		const tips = faker.lorem.sentence();
		jest.spyOn(crudFlavor, 'setFlavorTips').mockResolvedValue({ name: flavorName });
		jest.spyOn(crudFlavor, 'getFlavorTips').mockResolvedValue(tips);

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
                mutation FlavorTips($name: ID!, $tips: String!) {
                    flavorTips(name: $name, tips: $tips) {
                       success
					   flavor {
						   name
						   tips
					   }
                   }
               }
           `,
				variables: { name: flavorName, tips },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.flavorTips).toEqual({ success: true, flavor: { name: flavorName, tips } });
	});

	it('should throw an error with a bad input', async () => {
		const flavorName = faker.word.noun();
		const tips = faker.lorem.sentence();
		jest.spyOn(crudFlavor, 'setFlavorTips').mockResolvedValue({ name: flavorName });

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation FlavorTips($name: ID!, $tips: String!) {
                    flavorTips(name: $name, tips: $tips) {
                        success
                        flavor {
                            name
                            tips
                        }
                    }
                }
            `,
				variables: { name: null, tips },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudFlavor, 'setFlavorTips').mockRejectedValue(new InternalError('Server error'));
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
                mutation FlavorTips($name: ID!, $tips: String!) {
                    flavorTips(name: $name, tips: $tips) {
                        success
                        flavor {
                            name
                            tips
                        }
                    }
                }
            `,
				variables: { name: 'flavorName', tips: 'some tips' },
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
                mutation FlavorTips($name: ID!, $tips: String!) {
                    flavorTips(name: $name, tips: $tips) {
                        success
                        flavor {
                            name
                            tips
                        }
                    }
                }
            `,
				variables: { name: 'flavorName', tips: 'some tips' },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});
});
