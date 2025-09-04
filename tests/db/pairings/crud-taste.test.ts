import { FlavorTaste, Taste } from '../../../src/pairings/taste';
import { addTaste, createTaste, deleteTaste, getFlavorTastes, getTaste, getTastes, updateTaste } from '../../../src/db/pairings/crud-taste';
import * as crud from '../../../src/db/utils/crud';
import { Flavor } from '../../../src/pairings/flavor';
import { createFlavor } from '../../../src/db/pairings/crud-flavor';
import { addTechnique, createTechnique, getFlavorTechniques } from '../../../src/db/pairings/crud-technique';
import { FlavorTechnique, Technique } from '../../../src/pairings/technique';

describe('CRUD Taste', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a taste', async () => {
		const name = (global as any).getNextNoun();
		const taste = new Taste({ name });
		const createdTaste = await createTaste(taste);
		expect(createdTaste!.name).toBe(taste.name);
	});

	it('should return null if no taste was created', async () => {
		jest.spyOn(crud, 'createNode').mockResolvedValue(null);

		const name = (global as any).getNextNoun();
		const taste = new Taste({ name });
		const createdTaste = await createTaste(taste);
		expect(createdTaste).toBeNull();
	});

	it('should get a taste by name', async () => {
		const name = (global as any).getNextNoun();
		const taste = new Taste({ name });
		await createTaste(taste);
		const fetchedTaste = await getTaste(taste.name);
		expect(fetchedTaste!.name).toBe(taste.name);
	});

	it('should return null if no taste was found', async () => {
		const fetchedTaste = await getTaste('non_existing_taste');
		expect(fetchedTaste).toBeNull();
	});

	it('should update a taste', async () => {
		const name = (global as any).getNextNoun();
		const taste = new Taste({ name });
		await createTaste(taste);
		const updatedTaste = await updateTaste({ name, updatedName: 'updated_' + name });
		expect(updatedTaste!.name).toBe('updated_' + name);
	});

	it('should return null if no taste was found to update', async () => {
		const updatedTaste = await updateTaste({ name: 'non_existing_taste', updatedName: 'updated_name' });
		expect(updatedTaste).toBeNull();
	});

	it('should delete a taste', async () => {
		const name = (global as any).getNextNoun();
		const taste = new Taste({ name });
		await createTaste(taste);
		const deletedTaste = await deleteTaste(taste.name);
		expect(deletedTaste!.name).toBe(taste.name);
	});

	it('should return null if no taste was found to delete', async () => {
		const deletedTaste = await deleteTaste('non_existing_taste');
		expect(deletedTaste).toBeNull();
	});

	it('should return a list of created tastes', async () => {
		const tastes = Array.from({ length: 5 }, () => (global as any).getNextNoun());
		await Promise.all(tastes.map(taste => createTaste({ name: taste })));

		const fetchedTastes = await getTastes();
		expect(fetchedTastes).toBeInstanceOf(Array<Taste>);
		expect(fetchedTastes.length).toBeGreaterThan(0);
	});

	it('should return a taste when a FlavorTaste is added', async () => {
		const flavor = (global as any).getNextNoun();
		const taste = (global as any).getNextNoun();

		const createdTaste = await createTaste(new Taste({ name: taste }));
		const createdFlavor = await createFlavor(new Flavor({ name: flavor }));

		const flavorTaste = new FlavorTaste(createdFlavor!, createdTaste!);
		const addedTaste = await addTaste(flavorTaste);
		expect(addedTaste!.name).toBe(taste);
	});

	it('should return null if no FlavorTaste is added', async () => {
		const flavor = (global as any).getNextNoun();
		const taste = (global as any).getNextNoun();

		const createdTaste = new Taste({ name: taste });
		const createdFlavor = new Flavor({ name: flavor });

		const flavorTaste = new FlavorTaste(createdFlavor!, createdTaste!);
		const addedTaste = await addTaste(flavorTaste);
		expect(addedTaste).toBeNull();
	});

	it('should return a list of tastes attached to a flavor', async () => {
		const flavor = (global as any).getNextNoun('gft_');
		const taste = (global as any).getNextNoun('gft_');
		const taste2 = (global as any).getNextNoun('gft_');

		const createdTaste = await createTaste(new Taste({ name: taste }));
		const createdTaste2 = await createTaste(new Taste({ name: taste2 }));
		const createdFlavor = await createFlavor(new Flavor({ name: flavor }));

		const flavorTaste = new FlavorTaste(createdFlavor!, createdTaste!);
		const flavorTaste2 = new FlavorTaste(createdFlavor!, createdTaste2!);
		await addTaste(flavorTaste);
		await addTaste(flavorTaste2);

		const fetchedTastes = await getFlavorTastes(createdFlavor!);
		expect(fetchedTastes).toContainEqual(createdTaste);
		expect(fetchedTastes).toContainEqual(createdTaste2);
	});

	it('should return a list of techniques attached to a flavor', async () => {
		const flavor = (global as any).getNextNoun('gftq_');
		const technique = (global as any).getNextNoun('gftq_');
		const technique2 = (global as any).getNextNoun('gftq_');

		const createdTechnique = await createTechnique(new Technique({ name: technique }));
		const createdTechnique2 = await createTechnique(new Technique({ name: technique2 }));
		const createdFlavor = await createFlavor(new Flavor({ name: flavor }));

		const flavorTechnique = new FlavorTechnique(createdFlavor!, createdTechnique!);
		const flavorTechnique2 = new FlavorTechnique(createdFlavor!, createdTechnique2!);
		await addTechnique(flavorTechnique);
		await addTechnique(flavorTechnique2);

		const fetchedTechniques = await getFlavorTechniques(createdFlavor!);
		expect(fetchedTechniques).toContainEqual(createdTechnique);
		expect(fetchedTechniques).toContainEqual(createdTechnique2);
	});
});
