import { addTechnique, createTechnique, deleteTechnique, getTechnique, getTechniques, updateTechnique } from '../../db/pairings/crud-technique';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorTechnique, Technique } from '../../pairings/technique';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { isPermitted } from '../../_helpers/auth-helper';
import { unauthorizedError } from '../errors/errors';

export const resolvers: Resolvers = {
	Query: {
		technique: (_root, { name }) => getTechnique(name),
		techniques: () => getTechniques(),
	},
	Mutation: {
		createTechnique: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a technique');
			return createTechnique({ name });
		},
		updateTechnique: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a technique');
			return updateTechnique({ name, updatedName });
		},
		deleteTechnique: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a technique');
			return deleteTechnique(name);
		},
		addTechnique: async (_root, { input: { flavor, technique } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to add a technique');
			return addTechnique(new FlavorTechnique(new Flavor({ name: flavor }), new Technique({ name: technique })));
		},
	},
};
