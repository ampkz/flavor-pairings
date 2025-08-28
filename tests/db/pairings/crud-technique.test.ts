import { FlavorTechnique, Technique } from '../../../src/pairings/technique';
import {
	addTechnique,
	createTechnique,
	deleteTechnique,
	getTechnique,
	getTechniques,
	updateTechnique,
} from '../../../src/db/pairings/crud-technique';
import * as crud from '../../../src/db/utils/crud';
import { Flavor } from '../../../src/pairings/flavor';
import { createFlavor } from '../../../src/db/pairings/crud-flavor';

describe('CRUD Technique', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a technique', async () => {
		const name = (global as any).getNextNoun();
		const technique = new Technique({ name });
		const createdTechnique = await createTechnique(technique);
		expect(createdTechnique!.name).toBe(technique.name);
	});

	it('should return null if no technique was created', async () => {
		jest.spyOn(crud, 'createNode').mockResolvedValue(null);

		const name = (global as any).getNextNoun();
		const technique = new Technique({ name });
		const createdTechnique = await createTechnique(technique);
		expect(createdTechnique).toBeNull();
	});

	it('should get a technique by name', async () => {
		const name = (global as any).getNextNoun();
		const technique = new Technique({ name });
		await createTechnique(technique);
		const fetchedTechnique = await getTechnique(technique.name);
		expect(fetchedTechnique!.name).toBe(technique.name);
	});

	it('should return null if no technique was found', async () => {
		const fetchedTechnique = await getTechnique('non_existing_technique');
		expect(fetchedTechnique).toBeNull();
	});

	it('should update a technique', async () => {
		const name = (global as any).getNextNoun();
		const technique = new Technique({ name });
		await createTechnique(technique);
		const updatedTechnique = await updateTechnique({ name, updatedName: 'updated_' + name });
		expect(updatedTechnique!.name).toBe('updated_' + name);
	});

	it('should return null if no technique was found to update', async () => {
		const updatedTechnique = await updateTechnique({ name: 'non_existing_technique', updatedName: 'updated_name' });
		expect(updatedTechnique).toBeNull();
	});

	it('should delete a technique', async () => {
		const name = (global as any).getNextNoun();
		const technique = new Technique({ name });
		await createTechnique(technique);
		const deletedTechnique = await deleteTechnique(technique.name);
		expect(deletedTechnique!.name).toBe(technique.name);
	});

	it('should return null if no technique was found to delete', async () => {
		const deletedTechnique = await deleteTechnique('non_existing_technique');
		expect(deletedTechnique).toBeNull();
	});

	it('should return a list of created techniques', async () => {
		const techniques = Array.from({ length: 5 }, () => (global as any).getNextNoun());
		await Promise.all(techniques.map(t => createTechnique({ name: t })));

		const fetchedTechniques = await getTechniques();
		expect(fetchedTechniques).toBeInstanceOf(Array<Technique>);
		expect(fetchedTechniques.length).toBeGreaterThan(0);
	});

	it('should return a technique when a FlavorTechnique is added', async () => {
		const flavor = (global as any).getNextNoun();
		const technique = (global as any).getNextNoun();

		const createdTechnique = await createTechnique(new Technique({ name: technique }));
		const createdFlavor = await createFlavor(new Flavor({ name: flavor }));

		const flavorTechnique = new FlavorTechnique(createdFlavor!, createdTechnique!);
		const addedTechnique = await addTechnique(flavorTechnique);
		expect(addedTechnique!.name).toBe(technique);
	});

	it('should return null if no FlavorTechnique is added', async () => {
		const flavor = (global as any).getNextNoun();
		const technique = (global as any).getNextNoun();

		const createdTechnique = new Technique({ name: technique });
		const createdFlavor = new Flavor({ name: flavor });

		const flavorTechnique = new FlavorTechnique(createdFlavor!, createdTechnique!);
		const addedTechnique = await addTechnique(flavorTechnique);
		expect(addedTechnique).toBeNull();
	});
});
