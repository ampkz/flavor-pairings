import request from 'supertest';
import startServer from '../../../../src/server/server';
import { Express } from 'express';
import * as experimentalPairing from '../../../../src/db/pairings/experimental-pairing';
import { ExperimentalPairings } from '../../../../src/pairings/experimental-pairing';
import { Flavor } from '../../../../src/pairings/flavor';
import { Pairing } from '../../../../src/pairings/pairing';
import { PairingAffinity } from '../../../../src/generated/graphql';

describe('Experimental Pairings Queries', () => {
	let app: Express;

	beforeAll(async () => {
		app = await startServer();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return a list of experimental pairings', async () => {
		const exPairs: ExperimentalPairings = new ExperimentalPairings();
		exPairs.addPairing(new Pairing(new Flavor({ name: 'allspice' }), new Flavor({ name: 'cinnamon' }), PairingAffinity.Regular, null));
		exPairs.addPairing(new Pairing(new Flavor({ name: 'cinnamon' }), new Flavor({ name: 'african cuisine' }), PairingAffinity.Regular, null));
		exPairs.addPairing(new Pairing(new Flavor({ name: 'african cuisine' }), new Flavor({ name: 'allspice' }), PairingAffinity.Regular, null));

		jest.spyOn(experimentalPairing, 'getExperimentalPairings').mockResolvedValue(exPairs);
		const response = await request(app)
			.post('/graphql')
			.send({
				query: `
                    query ExperimentalPairing($input: ExperimentalPairingInput!) {
                        experimentalPairing(input: $input) {
                            uniqueFlavors {
                                name
                            }
                        }
                    }
                `,
			})
			.send({
				variables: {
					input: {
						flavor1: 'allspice',
						flavor2: 'african cuisine',
						maxLength: 2,
					},
				},
			});

		expect(response.status).toBe(200);
		expect(response.body.data.experimentalPairing).toBeDefined();
		expect(response.body.data.experimentalPairing.uniqueFlavors).toContainEqual({ name: 'allspice' });
		expect(response.body.data.experimentalPairing.uniqueFlavors).toContainEqual({ name: 'cinnamon' });
		expect(response.body.data.experimentalPairing.uniqueFlavors).toContainEqual({ name: 'african cuisine' });
	});
});
