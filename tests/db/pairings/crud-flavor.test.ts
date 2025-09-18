import { Flavor } from '../../../src/pairings/flavor';
import {
	createFlavor,
	createFlavorReference,
	deleteFlavor,
	deleteFlavorReference,
	getFlavor,
	getFlavorReference,
	getFlavors,
	getFlavorTips,
	setFlavorTips,
	updateFlavor,
} from '../../../src/db/pairings/crud-flavor';
import * as crud from '../../../src/db/utils/crud';
import { faker } from '@faker-js/faker';
import { createPairing, getFlavorPairings } from '../../../src/db/pairings/crud-pairing';
import { Pairing } from '../../../src/pairings/pairing';
import { PairingAffinity } from '../../../src/generated/graphql';

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

	it('should set tips of a flavor', async () => {
		const name = 'stf_' + faker.word.noun();
		const flavor = new Flavor({ name });
		await createFlavor(flavor);
		const updatedFlavor = await setFlavorTips(flavor, 'These are some tips');
		expect(updatedFlavor!.name).toBe(flavor.name);
		const tips = await getFlavorTips(flavor);
		expect(tips).toBe('These are some tips');
	});

	it('should return null if no tips where set for a flavor', async () => {
		const name = 'stf_' + faker.word.noun();
		const flavor = new Flavor({ name });
		const updatedFlavor = await setFlavorTips(flavor, 'These are some tips');
		expect(updatedFlavor).toBeNull();
		const tips = await getFlavorTips(flavor);
		expect(tips).toBeNull();
	});

	it('should unset tips of a flavor', async () => {
		const name = 'stf_' + faker.word.noun();
		const flavor = new Flavor({ name });
		await createFlavor(flavor);
		await setFlavorTips(flavor, 'These are some tips');
		const updatedFlavor = await setFlavorTips(flavor, null);
		expect(updatedFlavor!.name).toBe(flavor.name);
		const tips = await getFlavorTips(flavor);
		expect(tips).toBeNull();
	});

	it('should create a reference from one flavor to another', async () => {
		const name1 = 'ref_flavor1_' + faker.word.noun();
		const name2 = 'ref_flavor2_' + faker.word.noun();
		const flavor1 = new Flavor({ name: name1 });
		const flavor2 = new Flavor({ name: name2 });
		await createFlavor(flavor1);
		await createFlavor(flavor2);
		const [from, to] = await createFlavorReference(flavor1, flavor2);
		expect(from!.name).toBe(flavor1.name);
		expect(to!.name).toBe(flavor2.name);

		const reference = await getFlavorReference(flavor1);
		expect(reference!.name).toBe(flavor2.name);
	});

	it('should clear all relationships and tips when creating a new reference', async () => {
		const name1 = 'ref_flavor1_' + faker.word.noun();
		const name2 = 'ref_flavor2_' + faker.word.noun();
		const name3 = 'ref_flavor3_' + faker.word.noun();
		const flavor1 = new Flavor({ name: name1 });
		const flavor2 = new Flavor({ name: name2 });
		const flavor3 = new Flavor({ name: name3 });
		await createFlavor(flavor1);
		await createFlavor(flavor2);
		await createFlavor(flavor3);
		await setFlavorTips(flavor1, 'These are some tips');
		let tips = await getFlavorTips(flavor1);
		expect(tips).toBe('These are some tips');

		await createPairing(new Pairing(flavor1, flavor3, PairingAffinity.Bold, 'Especially with chocolate'));
		const pairingsBefore = await getFlavorPairings(flavor1);
		expect(pairingsBefore.length).toBe(1);

		await createFlavorReference(flavor1, flavor2);
		const reference = await getFlavorReference(flavor1);
		expect(reference!.name).toBe(flavor2.name);
		tips = await getFlavorTips(flavor1);
		expect(tips).toBeNull();

		const pairingsAfter = await getFlavorPairings(flavor1);
		expect(pairingsAfter.length).toBe(0);
	});

	it('should return null if no reference was created', async () => {
		const name1 = 'ref_flavor1_' + faker.word.noun();
		const name2 = 'ref_flavor2_' + faker.word.noun();
		const flavor1 = new Flavor({ name: name1 });
		const flavor2 = new Flavor({ name: name2 });
		const [from, to] = await createFlavorReference(flavor1, flavor2);
		expect(from).toBeNull();
		expect(to).toBeNull();

		const reference = await getFlavorReference(flavor1);
		expect(reference).toBeNull();
	});

	it('should return null if trying to create a reference to itself', async () => {
		const name1 = 'ref_flavor1_' + faker.word.noun();
		const flavor1 = new Flavor({ name: name1 });
		await createFlavor(flavor1);
		const [from, to] = await createFlavorReference(flavor1, flavor1);
		expect(from).toBeNull();
		expect(to).toBeNull();

		const reference = await getFlavorReference(flavor1);
		expect(reference).toBeNull();
	});

	it('should delete a reference from one flavor to another', async () => {
		const name1 = 'dref_flavor1_' + faker.word.noun();
		const name2 = 'dref_flavor2_' + faker.word.noun();
		const flavor1 = new Flavor({ name: name1 });
		const flavor2 = new Flavor({ name: name2 });
		await createFlavor(flavor1);
		await createFlavor(flavor2);
		await createFlavorReference(flavor1, flavor2);

		const [f1, f2] = await deleteFlavorReference(flavor1, flavor2);
		expect(f1!.name).toBe(flavor1.name);
		expect(f2!.name).toBe(flavor2.name);

		const reference = await getFlavorReference(flavor1);
		expect(reference).toBeNull();
	});

	it('should return null if no reference was found to delete', async () => {
		const name1 = 'dref_flavor1_' + faker.word.noun();
		const name2 = 'dref_flavor2_' + faker.word.noun();
		const flavor1 = new Flavor({ name: name1 });
		const flavor2 = new Flavor({ name: name2 });
		const [f1, f2] = await deleteFlavorReference(flavor1, flavor2);
		expect(f1).toBeNull();
		expect(f2).toBeNull();
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
