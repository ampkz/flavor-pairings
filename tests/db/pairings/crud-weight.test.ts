import { FlavorWeight, Weight } from '../../../src/pairings/weight';
import {
	addFlavorWeight,
	createWeight,
	deleteWeight,
	getFlavorWeights,
	getWeight,
	getWeights,
	removeFlavorWeight,
	updateWeight,
} from '../../../src/db/pairings/crud-weight';
import * as crud from '../../../src/db/utils/crud';
import { Flavor } from '../../../src/pairings/flavor';
import { createFlavor } from '../../../src/db/pairings/crud-flavor';

describe('CRUD Weight', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a weight', async () => {
		const name = (global as any).getNextNoun('w_');
		const weight = new Weight({ name });
		const createdWeight = await createWeight(weight);
		expect(createdWeight!.name).toBe(weight.name);
	});

	it('should return null if no weight was created', async () => {
		jest.spyOn(crud, 'createNode').mockResolvedValue(null);

		const name = (global as any).getNextNoun('w_');
		const weight = new Weight({ name });
		const createdWeight = await createWeight(weight);
		expect(createdWeight).toBeNull();
	});

	it('should get a weight by name', async () => {
		const name = (global as any).getNextNoun('w_');
		const weight = new Weight({ name });
		await createWeight(weight);
		const fetchedWeight = await getWeight(weight.name);
		expect(fetchedWeight!.name).toBe(weight.name);
	});

	it('should return null if no weight was found', async () => {
		const fetchedWeight = await getWeight('non_existing_weight');
		expect(fetchedWeight).toBeNull();
	});

	it('should update a weight', async () => {
		const name = (global as any).getNextNoun('w_');
		const weight = new Weight({ name });
		await createWeight(weight);
		const updatedWeight = await updateWeight({ name, updatedName: 'updated_' + name });
		expect(updatedWeight!.name).toBe('updated_' + name);
	});

	it('should return null if no weight was found to update', async () => {
		const updatedWeight = await updateWeight({ name: 'non_existing_weight', updatedName: 'updated_name' });
		expect(updatedWeight).toBeNull();
	});

	it('should delete a weight', async () => {
		const name = (global as any).getNextNoun('w_');
		const weight = new Weight({ name });
		await createWeight(weight);
		const deletedWeight = await deleteWeight(weight.name);
		expect(deletedWeight!.name).toBe(weight.name);
	});

	it('should return null if no weight was found to delete', async () => {
		const deletedWeight = await deleteWeight('non_existing_weight');
		expect(deletedWeight).toBeNull();
	});

	it('should return a list of created weights', async () => {
		const weights = Array.from({ length: 5 }, () => (global as any).getNextNoun());
		await Promise.all(weights.map(w => createWeight({ name: w })));

		const fetchedWeights = await getWeights();
		expect(fetchedWeights).toBeInstanceOf(Array<Weight>);
		expect(fetchedWeights.length).toBeGreaterThan(0);
	});

	it('should return a weight when a FlavorWeight is added', async () => {
		const flavor = (global as any).getNextNoun('fw_');
		const weight = (global as any).getNextNoun('fw_');

		const createdWeight = await createWeight(new Weight({ name: weight }));
		const createdFlavor = await createFlavor(new Flavor({ name: flavor }));

		const flavorWeight = new FlavorWeight(createdFlavor!, createdWeight!);
		const addedWeight = await addFlavorWeight(flavorWeight);
		expect(addedWeight!.name).toBe(weight);
	});

	it('should return null if no FlavorWeight is added', async () => {
		const flavor = (global as any).getNextNoun('fw_');
		const weight = (global as any).getNextNoun('fw_');

		const createdWeight = new Weight({ name: weight });
		const createdFlavor = new Flavor({ name: flavor });

		const flavorWeight = new FlavorWeight(createdFlavor!, createdWeight!);
		const addedWeight = await addFlavorWeight(flavorWeight);
		expect(addedWeight).toBeNull();
	});

	it('should remove a FlavorWeight', async () => {
		const flavor = (global as any).getNextNoun('fw_');
		const weight = (global as any).getNextNoun('fw_');

		const createdWeight = await createWeight(new Weight({ name: weight }));
		const createdFlavor = await createFlavor(new Flavor({ name: flavor }));

		const flavorWeight = new FlavorWeight(createdFlavor!, createdWeight!);
		await addFlavorWeight(flavorWeight);

		const removedWeight = await removeFlavorWeight(flavorWeight);
		expect(removedWeight!.name).toBe(weight);
	});

	it('should return null if no FlavorWeight is removed', async () => {
		const flavor = (global as any).getNextNoun('fw_');
		const weight = (global as any).getNextNoun('fw_');

		const createdWeight = new Weight({ name: weight });
		const createdFlavor = new Flavor({ name: flavor });

		const flavorWeight = new FlavorWeight(createdFlavor!, createdWeight!);
		const removedWeight = await removeFlavorWeight(flavorWeight);
		expect(removedWeight).toBeNull();
	});

	it('should get a list of weights related to a flavor', async () => {
		const flavor = (global as any).getNextNoun('fw_');
		const weight = (global as any).getNextNoun('fw_');

		const createdWeight = await createWeight(new Weight({ name: weight }));
		const createdFlavor = await createFlavor(new Flavor({ name: flavor }));

		const flavorWeight = new FlavorWeight(createdFlavor!, createdWeight!);
		await addFlavorWeight(flavorWeight);

		const relatedWeights = await getFlavorWeights(createdFlavor!);
		expect(relatedWeights).toContainEqual(expect.objectContaining({ name: weight }));
	});
});
