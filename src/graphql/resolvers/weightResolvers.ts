import { addFlavorWeight, createWeight, deleteWeight, getWeight, getWeights, removeFlavorWeight, updateWeight } from '../../db/pairings/crud-weight';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorWeight, Weight } from '../../pairings/weight';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { isPermitted } from '../../_helpers/auth-helper';
import { unauthorizedError, getGraphQLError } from '../errors/errors';

export const resolvers: Resolvers = {
	Query: {
		weight: (_root, { name }) => getWeight(name),
		weights: () => getWeights(),
	},
	Mutation: {
		createWeight: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a weight');
			let createdWeight = null;
			let message: string | null = null;
			try {
				createdWeight = await createWeight({ name });
			} catch (error) {
				const gqlError = getGraphQLError(`creating weight: ${name}`, error);
				if (gqlError.extensions?.code === 'CONFLICT') {
					message = `Weight with name '${name}' already exists`;
				} else {
					throw gqlError;
				}
			}

			return {
				success: !!createdWeight,
				weight: new Weight({ name }),
				message,
			};
		},
		updateWeight: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a weight');
			let updatedWeight = null;

			try {
				updatedWeight = await updateWeight({ name, updatedName });
			} catch (error) {
				throw getGraphQLError(`updating weight: ${name}`, error);
			}

			return {
				success: !!updatedWeight,
				weight: new Weight({ name: updatedName }),
				previousWeight: new Weight({ name }),
			};
		},
		deleteWeight: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a weight');
			let deletedWeight = null;

			try {
				deletedWeight = await deleteWeight(name);
			} catch (error) {
				throw getGraphQLError(`deleting weight: ${name}`, error);
			}

			return {
				success: !!deletedWeight,
				weight: new Weight({ name }),
			};
		},
		addFlavorWeight: async (_root, { input: { flavor, weight } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to add a weight');
			let addedWeight = null;

			try {
				addedWeight = await addFlavorWeight(new FlavorWeight(new Flavor({ name: flavor }), new Weight({ name: weight })));
			} catch (error) {
				throw getGraphQLError(`adding weight: ${weight} to flavor: ${flavor}`, error);
			}

			return {
				success: !!addedWeight,
				flavor: new Flavor({ name: flavor }),
				weight: new Weight({ name: weight }),
			};
		},
		removeFlavorWeight: async (_root, { input: { flavor, weight } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to remove a weight');
			let removedWeight = null;

			try {
				removedWeight = await removeFlavorWeight(new FlavorWeight(new Flavor({ name: flavor }), new Weight({ name: weight })));
			} catch (error) {
				throw getGraphQLError(`removing weight: ${weight} from flavor: ${flavor}`, error);
			}

			return {
				success: !!removedWeight,
				flavor: new Flavor({ name: flavor }),
				weight: new Weight({ name: weight }),
			};
		},
	},
};
