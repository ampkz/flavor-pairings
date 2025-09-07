import { createFlavor } from '../../../src/db/pairings/crud-flavor';
import { createPairing } from '../../../src/db/pairings/crud-pairing';
import { getExperimentalPairings } from '../../../src/db/pairings/experimental-pairing';
import { PairingAffinity } from '../../../src/generated/graphql';
import { Flavor } from '../../../src/pairings/flavor';
import { Pairing } from '../../../src/pairings/pairing';

describe('Experimental Pairings', () => {
	it('should return a list of experimental pairings', async () => {
		const flavor1 = (global as any).getNextNoun('exp_');
		const flavor2 = (global as any).getNextNoun('exp_');
		const intermediateFlavor = (global as any).getNextNoun('exp_');

		await createFlavor(new Flavor({ name: flavor1 }));
		await createFlavor(new Flavor({ name: flavor2 }));
		await createFlavor(new Flavor({ name: intermediateFlavor }));

		await createPairing(new Pairing(new Flavor({ name: flavor1 }), new Flavor({ name: intermediateFlavor }), PairingAffinity.Regular));
		await createPairing(new Pairing(new Flavor({ name: intermediateFlavor }), new Flavor({ name: flavor2 }), PairingAffinity.Regular));

		const pairings = await getExperimentalPairings(new Flavor({ name: flavor1 }), new Flavor({ name: flavor2 }), 2);
		expect(pairings.uniqueFlavors).toEqual(expect.arrayContaining([new Flavor({ name: intermediateFlavor })]));
		expect(pairings.pairingPaths.length).toBeGreaterThan(0);
	});
});
