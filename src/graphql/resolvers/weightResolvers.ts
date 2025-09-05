import { addWeight, createWeight, deleteWeight, getWeight, getWeights, updateWeight } from '../../db/pairings/crud-weight';
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

			try {
				createdWeight = await createWeight({ name });
			} catch (error) {
				throw getGraphQLError(`creating weight: ${name}`, error);
			}

			return createdWeight;
		},
		updateWeight: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a weight');
			let updatedWeight = null;

			try {
				updatedWeight = await updateWeight({ name, updatedName });
			} catch (error) {
				throw getGraphQLError(`updating weight: ${name}`, error);
			}

			return updatedWeight;
		},
		deleteWeight: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a weight');
			let deletedWeight = null;

			try {
				deletedWeight = await deleteWeight(name);
			} catch (error) {
				throw getGraphQLError(`deleting weight: ${name}`, error);
			}

			return deletedWeight;
		},
		addWeight: async (_root, { input: { flavor, weight } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to add a weight');
			let addedWeight = null;

			try {
				addedWeight = await addWeight(new FlavorWeight(new Flavor({ name: flavor }), new Weight({ name: weight })));
			} catch (error) {
				throw getGraphQLError(`adding weight: ${weight} to flavor: ${flavor}`, error);
			}

			return addedWeight;
		},
	},
};
