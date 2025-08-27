import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudFlavor from '../../../../src/db/pairings/crud-flavor';
import * as crudPairing from '../../../../src/db/pairings/crud-pairing';
import { faker } from '@faker-js/faker';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import { Flavor } from '../../../../src/pairings/flavor';

describe('Pairing Queries', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should return a list of pairings', async () => {
		const flavor1 = (global as any).getNextNoun();
		const flavor2 = (global as any).getNextNoun();
		const flavor3 = (global as any).getNextNoun();

		jest.spyOn(crudFlavor, 'getFlavor').mockResolvedValue(new Flavor({ name: flavor1 }));

		jest.spyOn(crudPairing, 'getFlavorPairings').mockResolvedValue([new Flavor({ name: flavor2 }), new Flavor({ name: flavor3 })]);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query Flavor($name: ID!) {
                    flavor(name: $name) {
                        name
                        pairings {
                            items {
                                name
                            }
                        }
                    }
                }
            `,
				variables: { name: flavor1 },
			})
			.expect(200);

		expect(response.body.data.flavor).toEqual({ name: flavor1, pairings: { items: [{ name: flavor2 }, { name: flavor3 }] } });
	});

	it('should throw an error with a bad input', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query Flavor($name: ID!) {
                    flavor(name: $name) {
                        name
                    }
                }
            `,
				variables: { name: null },
			})
			.expect(400);

		expect(response.body.errors).toBeDefined();
	});

	it('should throw an error if there was issue with the server', async () => {
		jest.spyOn(crudFlavor, 'getFlavor').mockResolvedValue(new Flavor({ name: (global as any).getNextNoun() }));
		jest.spyOn(crudPairing, 'getFlavorPairings').mockRejectedValue(new InternalError('Server error'));

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query Flavor($name: ID!) {
                    flavor(name: $name) {
                        name
                        pairings {
                            items {
                                name
                            }
                        }
                    }
                }
            `,
				variables: { name: 'test1' },
			})
			.expect(200);

		expect(response.body.errors).toBeDefined();
	});
});
