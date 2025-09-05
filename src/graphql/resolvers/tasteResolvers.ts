import { addTaste, createTaste, deleteTaste, getTaste, getTastes, updateTaste } from '../../db/pairings/crud-taste';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorTaste, Taste } from '../../pairings/taste';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { isPermitted } from '../../_helpers/auth-helper';
import { unauthorizedError, getGraphQLError } from '../errors/errors';

export const resolvers: Resolvers = {
	Query: {
		taste: (_root, { name }) => getTaste(name),
		tastes: () => getTastes(),
	},
	Mutation: {
		createTaste: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a taste');
			let createdTaste = null;

			try {
				createdTaste = await createTaste({ name });
			} catch (error) {
				throw getGraphQLError(`creating taste: ${name}`, error);
			}

			return createdTaste;
		},
		updateTaste: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a taste');
			let updatedTaste = null;

			try {
				updatedTaste = await updateTaste({ name, updatedName });
			} catch (error) {
				throw getGraphQLError(`updating taste: ${name}`, error);
			}

			return updatedTaste;
		},
		deleteTaste: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a taste');
			let deletedTaste = null;

			try {
				deletedTaste = await deleteTaste(name);
			} catch (error) {
				throw getGraphQLError(`deleting taste: ${name}`, error);
			}

			return deletedTaste;
		},
		addTaste: async (_root, { input: { flavor, taste } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to add a taste');
			let addedTaste = null;

			try {
				addedTaste = await addTaste(new FlavorTaste(new Flavor({ name: flavor }), new Taste({ name: taste })));
			} catch (error) {
				throw getGraphQLError(`adding taste: ${taste} to flavor: ${flavor}`, error);
			}

			return addedTaste;
		},
	},
};
