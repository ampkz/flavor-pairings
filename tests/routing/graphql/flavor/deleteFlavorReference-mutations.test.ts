import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudFlavor from '../../../../src/db/pairings/crud-flavor';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('DeleteFlavorReference mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should delete a flavor reference', async () => {
		const from = faker.word.noun();
		const to = faker.word.noun();
		jest.spyOn(crudFlavor, 'deleteFlavorReference').mockResolvedValue([{ name: from }, { name: to }] as any);

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
				mutation DeleteFlavorReference($input: FlavorReferenceInput!) {
					deleteFlavorReference(input: $input) {
						success
						from { name }
						to { name }
					}
				}
				`,
				variables: { input: { from, to } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.deleteFlavorReference).toEqual({ success: true, from: { name: from }, to: { name: to } });
	});

	it('should return unsuccessful if reference not deleted', async () => {
		const from = faker.word.noun();
		const to = faker.word.noun();
		jest.spyOn(crudFlavor, 'deleteFlavorReference').mockResolvedValue([null, null] as any);

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
				mutation DeleteFlavorReference($input: FlavorReferenceInput!) {
					deleteFlavorReference(input: $input) {
						success
						from { name }
						to { name }
					}
				}
				`,
				variables: { input: { from, to } },
			})
			.set('Cookie', [`token=${token}`]);

		expect(response.body.data.deleteFlavorReference).toEqual({ success: false, from: { name: from }, to: { name: to } });
	});

	it('should throw an error if there was an issue with the server', async () => {
		jest.spyOn(crudFlavor, 'deleteFlavorReference').mockRejectedValue(new InternalError('Server error'));

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
				mutation DeleteFlavorReference($input: FlavorReferenceInput!) {
					deleteFlavorReference(input: $input) {
						success
						from { name }
						to { name }
					}
				}
				`,
				variables: { input: { from: 'from', to: 'to' } },
			})
			.set('Cookie', [`token=${token}`]);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if the user is not authenticated', async () => {
		const from = faker.word.noun();
		const to = faker.word.noun();
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
				mutation DeleteFlavorReference($input: FlavorReferenceInput!) {
					deleteFlavorReference(input: $input) {
						success
						from { name }
						to { name }
					}
				}
				`,
				variables: { input: { from, to } },
			});
		expect(response.body.errors).toBeDefined();
	});
});
