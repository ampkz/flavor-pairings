import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudPairing from '../../../../src/db/pairings/crud-pairing';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import { PairingAffinity } from '../../../../src/generated/graphql';
import { Pairing } from '../../../../src/pairings/pairing';
import sessions from '@ampkz/auth-neo4j/token';
import { User } from '@ampkz/auth-neo4j/user';
import { Auth } from '@ampkz/auth-neo4j/auth';

describe('CreateFlavor mutations', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a pairing', async () => {
		const flavor1 = faker.word.noun();
		const flavor2 = faker.word.noun();
		const affinity = PairingAffinity.Regular;
		const pairing: Pairing = new Pairing({ name: flavor1 }, { name: flavor2 }, affinity);
		jest.spyOn(crudPairing, 'createPairing').mockResolvedValue(pairing);

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
					mutation CreatePairing($input: CreatePairingInput!) {
					createPairing(input: $input){
                            success
                            pairing {
                                flavor {
                                    name
                                }
                                paired {
                                    flavor {
                                        name
                                    }
                                    affinity
                                }
                            }
                        }
				}
            `,
				variables: { input: { flavor1, flavor2, affinity } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(200);

		expect(response.body.data.createPairing.success).toBe(true);
	});

	it('should throw an error with a bad input', async () => {
		const flavor1 = faker.word.noun();
		const flavor2 = faker.word.noun();
		const pairing = new Pairing({ name: flavor1 }, { name: flavor2 }, PairingAffinity.Regular);
		jest.spyOn(crudPairing, 'createPairing').mockResolvedValue(pairing);
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
                mutation CreatePairing($input: CreatePairingInput!) {
					createPairing(input: $input)
				}
            `,
				variables: { input: { flavor1: null, flavor2: null } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudPairing, 'createPairing').mockRejectedValue(new InternalError('Server error'));
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
                mutation CreatePairing($input: CreatePairingInput!) {
					createPairing(input: $input){
                            success
                            pairing {
                                flavor {
                                    name
                                }
                                paired {
                                    flavor {
                                        name
                                    }
                                    affinity
                                }
                            }
                        }
				}
            `,
				variables: { input: { flavor1: 'test1', flavor2: 'test2', affinity: PairingAffinity.Regular } },
			})
			.set('Cookie', [`token=${token}`])
			.expect(500);

		expect(response.body.errors).toBeDefined();
	});
});
