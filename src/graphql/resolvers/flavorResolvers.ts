import { Auth } from '@ampkz/auth-neo4j/auth';
import { isPermitted } from '../../_helpers/auth-helper';
import { Node, NodeType, RelationshipType } from '../../_helpers/nodes';
import { createFlavor, deleteFlavor, getFlavor, getFlavors, updateFlavor } from '../../db/pairings/crud-flavor';
import { createPairing, getFlavorPairings } from '../../db/pairings/crud-pairing';
import { getTotalNodeCountByType } from '../../db/utils/crud';
import { getTotalRelationshipsToNodes } from '../../db/utils/relationship/crud-relationship';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { Pairing } from '../../pairings/pairing';
import { unauthorizedError } from '../errors/errors';
import { getFlavorTastes } from '../../db/pairings/crud-taste';
import { getFlavorTechniques } from '../../db/pairings/crud-technique';
import { getFlavorWeights } from '../../db/pairings/crud-weight';
import { getFlavorVolumes } from '../../db/pairings/crud-volume';

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
		createFlavor: async (_root, { input: { name } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a flavor');
			return createFlavor({ name });
		},
		updateFlavor: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a flavor');
			return updateFlavor({ name, updatedName });
		},
		deleteFlavor: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a flavor');
			return deleteFlavor(name);
		},
		createPairing: async (_root, { input: { flavor1, flavor2, affinity } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a pairing');
			const createdPair = await createPairing(new Pairing(new Flavor({ name: flavor1 }), new Flavor({ name: flavor2 }), affinity));
			return { flavor: createdPair!.flavor1, paired: { flavor: createdPair!.flavor2, affinity: createdPair!.affinity } };
		},
	},
	Flavor: {
		taste: parent => getFlavorTastes(parent),
		technique: parent => getFlavorTechniques(parent),
		weight: parent => getFlavorWeights(parent),
		volume: parent => getFlavorVolumes(parent),
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
