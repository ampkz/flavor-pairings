import { addTechnique, createTechnique, deleteTechnique, getTechnique, getTechniques, updateTechnique } from '../../db/pairings/crud-technique';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorTechnique, Technique } from '../../pairings/technique';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { isPermitted } from '../../_helpers/auth-helper';
import { unauthorizedError, getGraphQLError } from '../errors/errors';

export const resolvers: Resolvers = {
	Query: {
		technique: (_root, { name }) => getTechnique(name),
		techniques: () => getTechniques(),
	},
	Mutation: {
		createTechnique: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a technique');
			let createdTechnique = null;

			try {
				createdTechnique = await createTechnique({ name });
			} catch (error) {
				throw getGraphQLError(`creating technique: ${name}`, error);
			}

			return createdTechnique;
		},
		updateTechnique: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a technique');
			let updatedTechnique = null;

			try {
				updatedTechnique = await updateTechnique({ name, updatedName });
			} catch (error) {
				throw getGraphQLError(`updating technique: ${name}`, error);
			}

			return updatedTechnique;
		},
		deleteTechnique: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a technique');
			let deletedTechnique = null;

			try {
				deletedTechnique = await deleteTechnique(name);
			} catch (error) {
				throw getGraphQLError(`deleting technique: ${name}`, error);
			}

			return deletedTechnique;
		},
		addTechnique: async (_root, { input: { flavor, technique } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to add a technique');
			let addedTechnique = null;

			try {
				addedTechnique = await addTechnique(new FlavorTechnique(new Flavor({ name: flavor }), new Technique({ name: technique })));
			} catch (error) {
				throw getGraphQLError(`adding technique: ${technique} to flavor: ${flavor}`, error);
			}

			return addedTechnique;
		},
	},
};
