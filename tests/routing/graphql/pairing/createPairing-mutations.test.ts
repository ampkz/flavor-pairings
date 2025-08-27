import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudPairing from '../../../../src/db/pairings/crud-pairing';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';

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
		jest.spyOn(crudPairing, 'createPairing').mockResolvedValue([{ name: flavor1 }, { name: flavor2 }]);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreatePairing($input: CreatePairingInput!) {
                    createPairing(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor1, flavor2 } },
			})
			.expect(200);

		expect(response.body.data.createPairing).toEqual([{ name: flavor1 }, { name: flavor2 }]);
	});

	it('should throw an error with a bad input', async () => {
		const flavor1 = faker.word.noun();
		const flavor2 = faker.word.noun();
		jest.spyOn(crudPairing, 'createPairing').mockResolvedValue([{ name: flavor1 }, { name: flavor2 }]);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreatePairing($input: CreatePairingInput!) {
                    createPairing(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor1: null, flavor2: null } },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudPairing, 'createPairing').mockRejectedValue(new InternalError('Server error'));

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                mutation CreatePairing($input: CreatePairingInput!) {
                    createPairing(input: $input) {
                        name
                    }
                }
            `,
				variables: { input: { flavor1: 'test1', flavor2: 'test2' } },
			})
			.expect(200);

		expect(response.body.errors).toBeDefined();
	});
});
