import { Auth } from '@ampkz/auth-neo4j/auth';
import { isPermitted } from '../../_helpers/auth-helper';
import { Node, NodeType, RelationshipType } from '../../_helpers/nodes';
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
} from '../../db/pairings/crud-flavor';
import { createPairing, deletePairing, getFlavorPairings, updatePairing } from '../../db/pairings/crud-pairing';
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
			let message: string | null = null;

			try {
				createdFlavor = await createFlavor({ name });
			} catch (error) {
				const gqlError = getGraphQLError(`creating flavor: ${name}`, error);
				if (gqlError.extensions?.code === 'CONFLICT') {
					message = `Flavor with name '${name}' already exists`;
				} else {
					throw gqlError;
				}
			}

			return {
				success: !!createdFlavor,
				flavor: new Flavor({ name }),
				message,
			};
		},
		updateFlavor: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a flavor');
			let updatedFlavor: Flavor | null = null;

			try {
				updatedFlavor = await updateFlavor({ name, updatedName });
			} catch (error) {
				throw getGraphQLError(`updating flavor: ${name}`, error);
			}

			return {
				success: !!updatedFlavor,
				flavor: new Flavor({ name: updatedName }),
				previousFlavor: new Flavor({ name }),
			};
		},
		deleteFlavor: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a flavor');
			let deletedFlavor: Flavor | null = null;

			try {
				deletedFlavor = await deleteFlavor(name);
			} catch (error) {
				throw getGraphQLError(`deleting flavor: ${name}`, error);
			}

			return {
				success: !!deletedFlavor,
				flavor: new Flavor({ name }),
			};
		},
		flavorTips: async (_root, { name, tips }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update flavor tips');
			let updatedFlavor: Flavor | null = null;

			try {
				updatedFlavor = await setFlavorTips(new Flavor({ name }), tips || null);
			} catch (error) {
				throw getGraphQLError(`updating flavor tips: ${name}`, error);
			}

			return {
				success: !!updatedFlavor,
				flavor: new Flavor({ name }),
				tips: tips || null,
			};
		},
		createPairing: async (_root, { input: { flavor1, flavor2, affinity, especially } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a pairing');

			let createdPair: Pairing | null = null;

			try {
				createdPair = await createPairing(new Pairing(new Flavor({ name: flavor1 }), new Flavor({ name: flavor2 }), affinity, especially));
			} catch (error) {
				throw getGraphQLError(`creating pairing: ${flavor1}-${affinity}->${flavor2}`, error);
			}

			return {
				success: !!createdPair,
				pairing: {
					flavor: new Flavor({ name: flavor1 }),
					paired: { flavor: new Flavor({ name: flavor2 }), affinity, especially: especially || null },
				},
			};
		},
		updatePairing: async (_root, { input: { flavor1, flavor2, affinity, updatedAffinity, updatedEspecially } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a pairing');

			let updatedPair: Pairing | null = null;
			const pairing = new Pairing(new Flavor({ name: flavor1 }), new Flavor({ name: flavor2 }), affinity);
			try {
				updatedPair = await updatePairing(pairing, updatedAffinity, updatedEspecially || null);
			} catch (error) {
				throw getGraphQLError(`updating pairing: ${flavor1}-${affinity}->${flavor2}`, error);
			}

			return {
				success: !!updatedPair,
				pairing: {
					flavor: new Flavor({ name: flavor1 }),
					paired: {
						flavor: new Flavor({ name: flavor2 }),
						affinity: updatedPair ? updatedPair.affinity : affinity,
						especially: updatedPair ? updatedPair.especially : updatedEspecially || null,
					},
				},
			};
		},
		deletePairing: async (_root, { input: { flavor1, flavor2, affinity } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a pairing');
			let deletedPair: Pairing | null = null;

			try {
				deletedPair = await deletePairing(new Pairing(new Flavor({ name: flavor1 }), new Flavor({ name: flavor2 }), affinity));
			} catch (error) {
				throw getGraphQLError(`deleting pairing: ${flavor1}-${flavor2}`, error);
			}

			return {
				success: !!deletedPair,
				pairing: { flavor: new Flavor({ name: flavor1 }), paired: { flavor: new Flavor({ name: flavor2 }), affinity } },
			};
		},
		createFlavorReference: async (_root, { input: { from, to } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR))
				throw unauthorizedError('You are not authorized to create a flavor reference');

			let fromFlavor: Flavor | null = null;
			let toFlavor: Flavor | null = null;

			try {
				[fromFlavor, toFlavor] = await createFlavorReference(new Flavor({ name: from }), new Flavor({ name: to }));
			} catch (error) {
				throw getGraphQLError(`creating flavor reference from: ${fromFlavor} to: ${toFlavor}`, error);
			}

			return {
				success: !!fromFlavor && !!toFlavor,
				from: new Flavor({ name: from }),
				to: new Flavor({ name: to }),
			};
		},
		deleteFlavorReference: async (_root, { input: { from, to } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR))
				throw unauthorizedError('You are not authorized to delete a flavor reference');

			let fromFlavor: Flavor | null = null;
			let toFlavor: Flavor | null = null;

			try {
				[fromFlavor, toFlavor] = await deleteFlavorReference(new Flavor({ name: from }), new Flavor({ name: to }));
			} catch (error) {
				throw getGraphQLError(`deleting flavor reference from: ${fromFlavor} to: ${toFlavor}`, error);
			}

			return {
				success: !!fromFlavor && !!toFlavor,
				from: new Flavor({ name: from }),
				to: new Flavor({ name: to }),
			};
		},
	},
	Flavor: {
		taste: parent => getFlavorTastes(parent),
		technique: parent => getFlavorTechniques(parent),
		weight: parent => getFlavorWeights(parent),
		volume: parent => getFlavorVolumes(parent),
		tips: parent => getFlavorTips(parent),
		see: parent => getFlavorReference(parent),
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
