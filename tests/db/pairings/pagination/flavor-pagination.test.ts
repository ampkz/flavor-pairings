import { NodeType } from '../../../../src/_helpers/nodes';
import { createFlavor, getFlavors } from '../../../../src/db/pairings/crud-flavor';
import { getTotalNodeCountByType } from '../../../../src/db/utils/crud';

describe('Flavor DB Pagination', () => {
	it('should return a list of created flavors', async () => {
		const flavors = Array.from({ length: 11 }, () => (global as any).getNextNoun('pagination_'));
		await Promise.all(flavors.map(flavor => createFlavor({ name: flavor })));

		const totalFlavors = await getTotalNodeCountByType(NodeType.FLAVOR);
		const flavorsPerPage = 3;

		let fetchedFlavors = await getFlavors(flavorsPerPage);
		expect(fetchedFlavors.length).toBeLessThanOrEqual(flavorsPerPage);
		for (let i = flavorsPerPage; i < totalFlavors; i += flavorsPerPage) {
			const paginatedFlavors = await getFlavors(flavorsPerPage, fetchedFlavors[fetchedFlavors.length - 1].name);
			expect(paginatedFlavors.length).toBeLessThanOrEqual(flavorsPerPage);
			fetchedFlavors = [...fetchedFlavors, ...paginatedFlavors];
		}

		expect(fetchedFlavors.length).toBeGreaterThanOrEqual(totalFlavors);
	});
});
