import { FlavorTaste, Taste } from '../../../src/pairings/taste';
import { addTaste, createTaste, deleteTaste, getTaste, getTastes, updateTaste } from '../../../src/db/pairings/crud-taste';
import * as crud from '../../../src/db/utils/crud';
import { Flavor } from '../../../src/pairings/flavor';
import { createFlavor } from '../../../src/db/pairings/crud-flavor';

describe('CRUD Taste', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a taste', async () => {
		const name = (global as any).uniqueNounsIterator.next().value;
		const taste = new Taste({ name });
		const createdTaste = await createTaste(taste);
		expect(createdTaste!.name).toBe(taste.name);
	});

	it('should return null if no taste was created', async () => {
		jest.spyOn(crud, 'createNode').mockResolvedValue(null);

		const name = (global as any).uniqueNounsIterator.next().value;
		const taste = new Taste({ name });
		const createdTaste = await createTaste(taste);
		expect(createdTaste).toBeNull();
	});

	it('should get a taste by name', async () => {
		const name = (global as any).uniqueNounsIterator.next().value;
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
		const name = (global as any).uniqueNounsIterator.next().value;
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
		const name = (global as any).uniqueNounsIterator.next().value;
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
		const tastes = Array.from({ length: 5 }, () => (global as any).uniqueNounsIterator.next().value);
		await Promise.all(tastes.map(taste => createTaste({ name: taste })));

		const fetchedTastes = await getTastes();
		expect(fetchedTastes).toBeInstanceOf(Array<Taste>);
		expect(fetchedTastes.length).toBeGreaterThan(0);
	});

	it('should return a taste when a FlavorTaste is added', async () => {
		const flavor = (global as any).uniqueNounsIterator.next().value;
		const taste = (global as any).uniqueNounsIterator.next().value;

		const createdTaste = await createTaste(new Taste({ name: taste }));
		const createdFlavor = await createFlavor(new Flavor({ name: flavor }));

		const flavorTaste = new FlavorTaste(createdFlavor!, createdTaste!);
		const addedTaste = await addTaste(flavorTaste);
		expect(addedTaste!.name).toBe(taste);
	});

	it('should return null if no FlavorTaste is added', async () => {
		const flavor = (global as any).uniqueNounsIterator.next().value;
		const taste = (global as any).uniqueNounsIterator.next().value;

		const createdTaste = new Taste({ name: taste });
		const createdFlavor = new Flavor({ name: flavor });

		const flavorTaste = new FlavorTaste(createdFlavor!, createdTaste!);
		const addedTaste = await addTaste(flavorTaste);
		expect(addedTaste).toBeNull();
	});
});
