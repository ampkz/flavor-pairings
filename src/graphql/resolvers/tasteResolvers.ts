import { addTaste, createTaste, deleteTaste, getTaste, getTastes, updateTaste } from '../../db/pairings/crud-taste';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorTaste, Taste } from '../../pairings/taste';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { isPermitted } from '../../_helpers/auth-helper';
import { unauthorizedError } from '../errors/errors';

export const resolvers: Resolvers = {
	Query: {
		taste: (_root, { name }) => getTaste(name),
		tastes: () => getTastes(),
	},
	Mutation: {
		createTaste: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a taste');
			return createTaste({ name });
		},
		updateTaste: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a taste');
			return updateTaste({ name, updatedName });
		},
		deleteTaste: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a taste');
			return deleteTaste(name);
		},
		addTaste: async (_root, { input: { flavor, taste } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to add a taste');
			return addTaste(new FlavorTaste(new Flavor({ name: flavor }), new Taste({ name: taste })));
		},
	},
};
