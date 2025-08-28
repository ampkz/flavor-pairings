import { createFlavor } from '../../../src/db/pairings/crud-flavor';
import { createPairing, getFlavorPairings } from '../../../src/db/pairings/crud-pairing';
import { Flavor } from '../../../src/pairings/flavor';
import { Pairing } from '../../../src/pairings/pairing';
import { PairingAffinity } from '../../../src/generated/graphql';

describe('CRUD Pairing', () => {
	it('should create a pairing', async () => {
		const flavor1 = new Flavor({ name: (global as any).getNextNoun() });
		const flavor2 = new Flavor({ name: (global as any).getNextNoun() });

		await createFlavor(flavor1);
		await createFlavor(flavor2);

		const pairing = new Pairing(flavor1, flavor2, PairingAffinity.Regular);
		const createdPairing = await createPairing(pairing);

		expect(createdPairing).toEqual(pairing);
	});

	it('should return null if pairing was not created', async () => {
		const flavor1 = new Flavor({ name: (global as any).getNextNoun() });
		const flavor2 = new Flavor({ name: (global as any).getNextNoun() });

		const pairing = new Pairing(flavor1, flavor2, PairingAffinity.Bold);

		const createdPairing = await createPairing(pairing);

		expect(createdPairing).toBeNull();
	});

	it('should return a list of created pairings', async () => {
		const flavor1 = new Flavor({ name: (global as any).getNextNoun('lcp_') });
		await createFlavor(flavor1);

		const flavors = Array.from({ length: 5 }, () => new Flavor({ name: (global as any).getNextNoun('lcp_') }));
		await Promise.all(
			flavors.map(async flavor => {
				const createdFlavor = (await createFlavor(flavor))!;
				await createPairing(new Pairing(flavor1, createdFlavor, PairingAffinity.Regular));
			})
		);

		const pairings = await getFlavorPairings(flavor1);

		flavors.map(flavor => {
			expect(pairings).toContainEqual({ flavor, affinity: PairingAffinity.Regular });
		});
	});
});
