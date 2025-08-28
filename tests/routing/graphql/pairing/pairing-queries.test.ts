import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as crudFlavor from '../../../../src/db/pairings/crud-flavor';
import * as crudPairing from '../../../../src/db/pairings/crud-pairing';
import { InternalError } from '@ampkz/auth-neo4j/errors';
import { Flavor } from '../../../../src/pairings/flavor';
import { PairingAffinity } from '../../../../src/generated/graphql';
import { Pairing } from '../../../../src/pairings/pairing';

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

		const pairing1 = new Pairing({ name: flavor1 }, { name: flavor2 }, PairingAffinity.Regular);
		const pairing2 = new Pairing({ name: flavor1 }, { name: flavor3 }, PairingAffinity.Avoid);

		const paired1 = { flavor: pairing1.flavor2, affinity: pairing1.affinity };
		const paired2 = { flavor: pairing2.flavor2, affinity: pairing2.affinity };

		jest.spyOn(crudFlavor, 'getFlavor').mockResolvedValue(new Flavor({ name: flavor1 }));

		jest.spyOn(crudPairing, 'getFlavorPairings').mockResolvedValue([paired1, paired2]);

		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                query Flavor($name: ID!) {
					flavor(name: $name) {
						name
						pairings {
							items {
								flavor {
									name
								}
							}
						}
					}
				}
            `,
				variables: { name: flavor1 },
			})
			.expect(200);

		expect(response.body.data.flavor).toEqual({
			name: flavor1,
			pairings: { items: [{ flavor: { name: flavor2 } }, { flavor: { name: flavor3 } }] },
		});
	});

	it('should throw an error with a bad input', async () => {
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
               	query Flavor($name: ID!) {
					flavor(name: $name) {
						name
						pairings {
							items {
								flavor {
									name
								}
							}
						}
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
								flavor {
									name
								}
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
