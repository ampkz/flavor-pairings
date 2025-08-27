import { Node, NodeType, RelationshipType } from '../../_helpers/nodes';
import { createFlavor, deleteFlavor, getFlavor, getFlavors, updateFlavor } from '../../db/pairings/crud-flavor';
import { createPairing, getFlavorPairings } from '../../db/pairings/crud-pairing';
import { getTotalNodeCountByType } from '../../db/utils/crud';
import { getTotalRelationshipsToNodes } from '../../db/utils/relationship/crud-relationship';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { Pairing } from '../../pairings/pairing';

export const resolvers: Resolvers = {
	Query: {
		flavor: (_root, { name }) => getFlavor(name),
		flavors: async (_root, { limit, cursor }) => {
			const items = await getFlavors(limit, cursor);
			const totalCount = await getTotalNodeCountByType(NodeType.FLAVOR);
			return {
				items,
				totalCount,
			};
		},
	},
	Mutation: {
		createFlavor: (_root, { input: { name } }) => createFlavor({ name }),
		updateFlavor: (_root, { input: { name, updatedName } }) => updateFlavor({ name, updatedName }),
		deleteFlavor: (_root, { name }) => deleteFlavor(name),
		createPairing: (_root, { input: { flavor1, flavor2 } }) =>
			createPairing(new Pairing(new Flavor({ name: flavor1 }), new Flavor({ name: flavor2 }))),
	},
	Flavor: {
		pairings: async (parent, { limit, cursor }) => {
			const items = await getFlavorPairings(parent, limit, cursor);
			const node: Node = new Node(NodeType.FLAVOR, 'name', parent.name);
			const totalCount = await getTotalRelationshipsToNodes(node, NodeType.FLAVOR, RelationshipType.PAIRS_WITH);
			return {
				items,
				totalCount,
			};
		},
	},
};
