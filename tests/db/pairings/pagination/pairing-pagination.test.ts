import { Node, NodeType, RelationshipType } from '../../../../src/_helpers/nodes';
import { createFlavor } from '../../../../src/db/pairings/crud-flavor';
import { createPairing, getFlavorPairings } from '../../../../src/db/pairings/crud-pairing';
import { getTotalRelationshipsToNodes } from '../../../../src/db/utils/relationship/crud-relationship';
import { PairingAffinity } from '../../../../src/generated/graphql';
import { Flavor } from '../../../../src/pairings/flavor';
import { Pairing } from '../../../../src/pairings/pairing';

describe('Pairing DB Pagination', () => {
	it('should return a list of created flavor pairings', async () => {
		const firstFlavor = new Flavor({ name: (global as any).getNextNoun('pairing_pagingation_') });
		await createFlavor(firstFlavor);
		const flavors = Array.from({ length: 10 }, () => (global as any).getNextNoun('pairing_pagingation_'));

		await Promise.all(
			flavors.map(async flavor => {
				const pairedFlavor = await createFlavor({ name: flavor });
				const pairing: Pairing = new Pairing(firstFlavor, pairedFlavor!, PairingAffinity.Regular);
				await createPairing(pairing);
			})
		);

		const node: Node = new Node(NodeType.FLAVOR, 'name', firstFlavor.name);

		const totalPairings = await getTotalRelationshipsToNodes(node, NodeType.FLAVOR, RelationshipType.PAIRS_WITH);
		const pairingsPerPage = 2;

		let fetchedPairings = await getFlavorPairings(firstFlavor, pairingsPerPage);

		expect(fetchedPairings.length).toBeLessThanOrEqual(pairingsPerPage);

		for (let i = pairingsPerPage; i < totalPairings; i += pairingsPerPage) {
			const paginatedPairings = await getFlavorPairings(firstFlavor, pairingsPerPage, fetchedPairings[fetchedPairings.length - 1].flavor.name);
			expect(paginatedPairings.length).toBeLessThanOrEqual(pairingsPerPage);
			fetchedPairings = [...fetchedPairings, ...paginatedPairings];
		}

		expect(fetchedPairings.length).toBeGreaterThanOrEqual(totalPairings);
	});
});
