import { createFlavor } from '../../../src/db/pairings/crud-flavor';
import { createPairing, deletePairing, getFlavorPairings } from '../../../src/db/pairings/crud-pairing';
import { Flavor } from '../../../src/pairings/flavor';
import { Pairing } from '../../../src/pairings/pairing';
import { PairingAffinity } from '../../../src/generated/graphql';

describe('CRUD Pairing', () => {
	it('should create a pairing', async () => {
		const flavor1 = new Flavor({ name: (global as any).getNextNoun('lcp_') });
		const flavor2 = new Flavor({ name: (global as any).getNextNoun('lcp_') });

		await createFlavor(flavor1);
		await createFlavor(flavor2);

		const pairing = new Pairing(flavor1, flavor2, PairingAffinity.Regular, 'especially with desserts');
		const createdPairing = await createPairing(pairing);

		expect(createdPairing).toEqual(pairing);
	});

	it('should return null if pairing was not created', async () => {
		const flavor1 = new Flavor({ name: (global as any).getNextNoun('lcp_') });
		const flavor2 = new Flavor({ name: (global as any).getNextNoun('lcp_') });

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
				await createPairing(new Pairing(flavor1, createdFlavor, PairingAffinity.Regular, 'especially with desserts'));
			})
		);

		const pairings = await getFlavorPairings(flavor1);

		flavors.map(flavor => {
			expect(pairings).toContainEqual({ flavor, affinity: PairingAffinity.Regular, especially: 'especially with desserts' });
		});
	});

	it('should delete a pairing', async () => {
		const flavor1 = new Flavor({ name: (global as any).getNextNoun('lcp_') });
		const flavor2 = new Flavor({ name: (global as any).getNextNoun('lcp_') });

		await createFlavor(flavor1);
		await createFlavor(flavor2);

		const pairing = new Pairing(flavor1, flavor2, PairingAffinity.Regular);
		await createPairing(pairing);

		const deleted = await deletePairing(pairing);
		expect(deleted).toBe(pairing);
	});

	it('should return null if no pairing was deleted', async () => {
		const flavor1 = new Flavor({ name: (global as any).getNextNoun('lcp_') });
		const flavor2 = new Flavor({ name: (global as any).getNextNoun('lcp_') });

		const pairing = new Pairing(flavor1, flavor2, PairingAffinity.Regular);

		const deleted = await deletePairing(pairing);
		expect(deleted).toBeNull();
	});
});
