import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudPairing from '../../../../src/db/pairings/crud-pairing';
import { faker } from '@faker-js/faker';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { InternalError } from '@ampkz/auth-neo4j/errors';

describe('UpdatePairing mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should update a pairing', async () => {
		const flavor1 = faker.word.noun();
		const flavor2 = faker.word.noun();
		const affinity = 'REGULAR';
		const updatedAffinity = 'BOLD';
		const updatedEspecially = 'extra';

		// mock updatePairing to return a Pairing-like object when successful
		jest.spyOn(crudPairing, 'updatePairing').mockResolvedValue({ affinity: updatedAffinity, especially: updatedEspecially } as any);

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
				mutation UpdatePairing($input: UpdatePairingInput!) {
					updatePairing(input: $input) {
						success
						pairing { flavor { name } paired { flavor { name } affinity especially } }
					}
				}
				`,
				variables: { input: { flavor1, flavor2, affinity, updatedAffinity, updatedEspecially } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.updatePairing).toEqual({
			success: true,
			pairing: {
				flavor: { name: flavor1 },
				paired: { flavor: { name: flavor2 }, affinity: updatedAffinity, especially: updatedEspecially },
			},
		});
	});

	it('should return unsuccessful if no pairing was updated', async () => {
		const flavor1 = faker.word.noun();
		const flavor2 = faker.word.noun();
		const affinity = 'REGULAR';
		const updatedAffinity = 'BOLD';

		jest.spyOn(crudPairing, 'updatePairing').mockResolvedValue(null as any);

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
				mutation UpdatePairing($input: UpdatePairingInput!) {
					updatePairing(input: $input) {
						success
						pairing { flavor { name } paired { flavor { name } affinity especially } }
					}
				}
				`,
				variables: { input: { flavor1, flavor2, affinity, updatedAffinity } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.updatePairing).toEqual({
			success: false,
			pairing: {
				flavor: { name: flavor1 },
				paired: { flavor: { name: flavor2 }, affinity: affinity, especially: null },
			},
		});
	});

	it('should throw an error if the user is not authorized', async () => {
		const flavor1 = faker.word.noun();
		const flavor2 = faker.word.noun();
		const affinity = 'REGULAR';
		const updatedAffinity = 'BOLD';

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
				mutation UpdatePairing($input: UpdatePairingInput!) {
					updatePairing(input: $input) {
						success
						pairing { flavor { name } paired { flavor { name } affinity especially } }
					}
				}
				`,
				variables: { input: { flavor1, flavor2, affinity, updatedAffinity } },
			})
			.expect(401);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was an issue with the server', async () => {
		jest.spyOn(crudPairing, 'updatePairing').mockRejectedValue(new InternalError('Server error'));

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
				mutation UpdatePairing($input: UpdatePairingInput!) {
					updatePairing(input: $input) {
						success
						pairing { flavor { name } paired { flavor { name } affinity especially } }
					}
				}
				`,
				variables: { input: { flavor1: 'f1', flavor2: 'f2', affinity: 'REGULAR', updatedAffinity: 'BOLD' } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(500);

		expect(response.body.errors).toBeDefined();
	});
});
