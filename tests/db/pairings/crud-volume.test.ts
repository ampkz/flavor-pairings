import { FlavorVolume, Volume } from '../../../src/pairings/volume';
import {
	addFlavorVolume,
	createVolume,
	deleteVolume,
	getFlavorVolumes,
	getVolume,
	getVolumes,
	removeFlavorVolume,
	updateVolume,
} from '../../../src/db/pairings/crud-volume';
import * as crud from '../../../src/db/utils/crud';
import { Flavor } from '../../../src/pairings/flavor';
import { createFlavor } from '../../../src/db/pairings/crud-flavor';

describe('CRUD Volume', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a volume', async () => {
		const name = (global as any).getNextNoun('volume_');
		const volume = new Volume({ name });
		const createdVolume = await createVolume(volume);
		expect(createdVolume!.name).toBe(volume.name);
	});

	it('should return null if no volume was created', async () => {
		jest.spyOn(crud, 'createNode').mockResolvedValue(null);

		const name = (global as any).getNextNoun('volume_');
		const volume = new Volume({ name });
		const createdVolume = await createVolume(volume);
		expect(createdVolume).toBeNull();
	});

	it('should get a volume by name', async () => {
		const name = (global as any).getNextNoun('volume_');
		const volume = new Volume({ name });
		await createVolume(volume);
		const fetchedVolume = await getVolume(volume.name);
		expect(fetchedVolume!.name).toBe(volume.name);
	});

	it('should return null if no volume was found', async () => {
		const fetchedVolume = await getVolume('non_existing_volume');
		expect(fetchedVolume).toBeNull();
	});

	it('should update a volume', async () => {
		const name = (global as any).getNextNoun('volume_');
		const volume = new Volume({ name });
		await createVolume(volume);
		const updatedVolume = await updateVolume({ name, updatedName: 'updated_' + name });
		expect(updatedVolume!.name).toBe('updated_' + name);
	});

	it('should return null if no volume was found to update', async () => {
		const updatedVolume = await updateVolume({ name: 'non_existing_volume', updatedName: 'updated_name' });
		expect(updatedVolume).toBeNull();
	});

	it('should delete a volume', async () => {
		const name = (global as any).getNextNoun('volume_');
		const volume = new Volume({ name });
		await createVolume(volume);
		const deletedVolume = await deleteVolume(volume.name);
		expect(deletedVolume!.name).toBe(volume.name);
	});

	it('should return null if no volume was found to delete', async () => {
		const deletedVolume = await deleteVolume('non_existing_volume');
		expect(deletedVolume).toBeNull();
	});

	it('should return a list of created volumes', async () => {
		const volumes = Array.from({ length: 5 }, () => (global as any).getNextNoun('volume_'));
		await Promise.all(volumes.map(v => createVolume({ name: v })));

		const fetchedVolumes = await getVolumes();
		expect(fetchedVolumes).toBeInstanceOf(Array<Volume>);
		expect(fetchedVolumes.length).toBeGreaterThan(0);
	});

	it('should return a volume when a FlavorVolume is added', async () => {
		const flavor = (global as any).getNextNoun('volume_');
		const volume = (global as any).getNextNoun('volume_');

		const createdVolume = await createVolume(new Volume({ name: volume }));
		const createdFlavor = await createFlavor(new Flavor({ name: flavor }));

		const flavorVolume = new FlavorVolume(createdFlavor!, createdVolume!);
		const addedVolume = await addFlavorVolume(flavorVolume);
		expect(addedVolume!.name).toBe(volume);
	});

	it('should return null if no FlavorVolume is added', async () => {
		const flavor = (global as any).getNextNoun('volume_');
		const volume = (global as any).getNextNoun('volume_');

		const createdVolume = new Volume({ name: volume });
		const createdFlavor = new Flavor({ name: flavor });

		const flavorVolume = new FlavorVolume(createdFlavor!, createdVolume!);
		const addedVolume = await addFlavorVolume(flavorVolume);
		expect(addedVolume).toBeNull();
	});

	it('should remove a FlavorVolume', async () => {
		const flavor = (global as any).getNextNoun('volume_');
		const volume = (global as any).getNextNoun('volume_');

		const createdVolume = await createVolume(new Volume({ name: volume }));
		const createdFlavor = await createFlavor(new Flavor({ name: flavor }));

		const flavorVolume = new FlavorVolume(createdFlavor!, createdVolume!);
		await addFlavorVolume(flavorVolume);

		const removedVolume = await removeFlavorVolume(flavorVolume);
		expect(removedVolume!.name).toBe(volume);
	});

	it('should return null if no FlavorVolume is removed', async () => {
		const flavor = (global as any).getNextNoun('volume_');
		const volume = (global as any).getNextNoun('volume_');

		const createdVolume = new Volume({ name: volume });
		const createdFlavor = new Flavor({ name: flavor });

		const flavorVolume = new FlavorVolume(createdFlavor!, createdVolume!);
		const removedVolume = await removeFlavorVolume(flavorVolume);
		expect(removedVolume).toBeNull();
	});

	it('should get a list of volumes related to a flavor', async () => {
		const flavor = (global as any).getNextNoun('volume_');
		const volume = (global as any).getNextNoun('volume_');

		const createdVolume = await createVolume(new Volume({ name: volume }));
		const createdFlavor = await createFlavor(new Flavor({ name: flavor }));

		const flavorVolume = new FlavorVolume(createdFlavor!, createdVolume!);
		await addFlavorVolume(flavorVolume);

		const relatedVolumes = await getFlavorVolumes(createdFlavor!);
		expect(relatedVolumes).toContainEqual(expect.objectContaining({ name: volume }));
	});
});
