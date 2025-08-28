import { addWeight, createWeight, deleteWeight, getWeight, getWeights, updateWeight } from '../../db/pairings/crud-weight';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorWeight, Weight } from '../../pairings/weight';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { isPermitted } from '../../_helpers/auth-helper';
import { unauthorizedError } from '../errors/errors';

export const resolvers: Resolvers = {
	Query: {
		weight: (_root, { name }) => getWeight(name),
		weights: () => getWeights(),
	},
	Mutation: {
		createWeight: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a weight');
			return createWeight({ name });
		},
		updateWeight: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a weight');
			return updateWeight({ name, updatedName });
		},
		deleteWeight: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a weight');
			return deleteWeight(name);
		},
		addWeight: async (_root, { input: { flavor, weight } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to add a weight');
			return addWeight(new FlavorWeight(new Flavor({ name: flavor }), new Weight({ name: weight })));
		},
	},
};
