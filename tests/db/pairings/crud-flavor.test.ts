import { Flavor } from '../../../src/pairings/flavor';
import { createFlavor, deleteFlavor, getFlavor, getFlavors, updateFlavor } from '../../../src/db/pairings/crud-flavor';
import * as crud from '../../../src/db/utils/crud';
import { faker } from '@faker-js/faker';

describe('CRUD Flavor', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a flavor', async () => {
		const name = 'cf_' + faker.word.noun();
		const flavor = new Flavor({ name });
		const createdFlavor = await createFlavor(flavor);
		expect(createdFlavor!.name).toBe(flavor.name);
	});

	it('should return null if no flavor was created', async () => {
		jest.spyOn(crud, 'createNode').mockResolvedValue(null);

		const name = 'cf_' + faker.word.noun();
		const flavor = new Flavor({ name });
		const createdFlavor = await createFlavor(flavor);
		expect(createdFlavor).toBeNull();
	});

	it('should get a flavor by name', async () => {
		const name = 'df_' + faker.word.noun();
		const flavor = new Flavor({ name });
		await createFlavor(flavor);
		const fetchedFlavor = await getFlavor(flavor.name);
		expect(fetchedFlavor!.name).toBe(flavor.name);
	});

	it('should return null if no flavor was found', async () => {
		const fetchedFlavor = await getFlavor('non_existing_flavor');
		expect(fetchedFlavor).toBeNull();
	});

	it('should update a flavor', async () => {
		const name = 'uf_' + faker.word.noun();
		const flavor = new Flavor({ name });
		await createFlavor(flavor);
		const updatedFlavor = await updateFlavor({ name, updatedName: 'updated_' + name });
		expect(updatedFlavor!.name).toBe('updated_' + name);
	});

	it('should return null if no flavor was found to update', async () => {
		const updatedFlavor = await updateFlavor({ name: 'non_existing_flavor', updatedName: 'updated_name' });
		expect(updatedFlavor).toBeNull();
	});

	it('should delete a flavor', async () => {
		const name = 'df_' + faker.word.noun();
		const flavor = new Flavor({ name });
		await createFlavor(flavor);
		const deletedFlavor = await deleteFlavor(flavor.name);
		expect(deletedFlavor!.name).toBe(flavor.name);
	});

	it('should return null if no flavor was found to delete', async () => {
		const deletedFlavor = await deleteFlavor('non_existing_flavor');
		expect(deletedFlavor).toBeNull();
	});

	it('should return a list of created flavors', async () => {
		const flavors = Array.from({ length: 5 }, () => `cfl_${faker.word.noun()}`);
		await Promise.all(flavors.map(flavor => createFlavor({ name: flavor })));

		const fetchedFlavors = await getFlavors();
		expect(fetchedFlavors).toBeInstanceOf(Array<Flavor>);
		expect(fetchedFlavors.length).toBeGreaterThan(0);
	});
});
