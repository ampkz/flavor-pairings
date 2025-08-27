import { create } from 'domain';
import { createFlavor } from '../../../src/db/pairings/crud-flavor';
import { createPairing, getFlavorPairings } from '../../../src/db/pairings/crud-pairing';
import { Flavor } from '../../../src/pairings/flavor';
import { Pairing } from '../../../src/pairings/pairing';

describe('CRUD Pairing', () => {
	it('should create a pairing', async () => {
		const flavor1 = new Flavor({ name: (global as any).uniqueNounsIterator.next().value });
		const flavor2 = new Flavor({ name: (global as any).uniqueNounsIterator.next().value });

		await createFlavor(flavor1);
		await createFlavor(flavor2);

		const pairing = new Pairing(flavor1, flavor2);

		const [createdFlavor1, createdFlavor2] = await createPairing(pairing);

		expect(createdFlavor1).toEqual(flavor1);
		expect(createdFlavor2).toEqual(flavor2);
	});

	it('should return null if pairing was not created', async () => {
		const flavor1 = new Flavor({ name: (global as any).uniqueNounsIterator.next().value });
		const flavor2 = new Flavor({ name: (global as any).uniqueNounsIterator.next().value });

		const pairing = new Pairing(flavor1, flavor2);

		const [f1, f2] = await createPairing(pairing);

		expect(f1).toBeNull();
		expect(f2).toBeNull();
	});

	it('should return a list of created pairings', async () => {
		const flavor1 = new Flavor({ name: (global as any).uniqueNounsIterator.next().value });
		await createFlavor(flavor1);

		const flavors = Array.from({ length: 5 }, () => new Flavor({ name: (global as any).uniqueNounsIterator.next().value }));
		await Promise.all(
			flavors.map(async flavor => {
				const createdFlavor = (await createFlavor(flavor))!;
				await createPairing(new Pairing(flavor1, createdFlavor));
			})
		);

		const pairings = await getFlavorPairings(flavor1);

		flavors.map(flavor => {
			expect(pairings).toContainEqual(flavor);
		});
	});
});
