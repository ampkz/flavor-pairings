import { Auth } from '@ampkz/auth-neo4j/auth';
import { isPermitted } from '../../_helpers/auth-helper';
import { Node, NodeType, RelationshipType } from '../../_helpers/nodes';
import { createFlavor, deleteFlavor, getFlavor, getFlavors, updateFlavor } from '../../db/pairings/crud-flavor';
import { createPairing, deletePairing, getFlavorPairings } from '../../db/pairings/crud-pairing';
import { getTotalNodeCountByType } from '../../db/utils/crud';
import { getTotalRelationshipsToNodes } from '../../db/utils/relationship/crud-relationship';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { Pairing } from '../../pairings/pairing';
import { getGraphQLError, internalError, unauthorizedError } from '../errors/errors';
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

			let createdFlavor: Flavor | null = null;

			try {
				createdFlavor = await createFlavor({ name });
			} catch (error) {
				throw getGraphQLError(`creating flavor: ${name}`, error);
			}

			return createdFlavor;
		},
		updateFlavor: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a flavor');
			let updatedFlavor: Flavor | null = null;

			try {
				updatedFlavor = await updateFlavor({ name, updatedName });
			} catch (error) {
				throw getGraphQLError(`updating flavor: ${name}`, error);
			}

			return updatedFlavor;
		},
		deleteFlavor: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a flavor');
			let deletedFlavor: Flavor | null = null;

			try {
				deletedFlavor = await deleteFlavor(name);
			} catch (error) {
				throw getGraphQLError(`deleting flavor: ${name}`, error);
			}

			return deletedFlavor;
		},
		createPairing: async (_root, { input: { flavor1, flavor2, affinity } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a pairing');
			let createdPair: Pairing | null = null;

			try {
				createdPair = await createPairing(new Pairing(new Flavor({ name: flavor1 }), new Flavor({ name: flavor2 }), affinity));
			} catch (error) {
				throw getGraphQLError(`creating pairing: ${flavor1}-${affinity}->${flavor2}`, error);
			}

			return !!createdPair;
		},
		deletePairing: async (_root, { input: { flavor1, flavor2, affinity } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a pairing');
			let deletedPair: Pairing | null = null;

			try {
				deletedPair = await deletePairing(new Pairing(new Flavor({ name: flavor1 }), new Flavor({ name: flavor2 }), affinity));
			} catch (error) {
				throw getGraphQLError(`deleting pairing: ${flavor1}-${flavor2}`, error);
			}

			return !!deletedPair;
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
