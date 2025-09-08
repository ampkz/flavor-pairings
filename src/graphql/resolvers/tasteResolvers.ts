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
			let message: string | null = null;

			try {
				createdTaste = await createTaste({ name });
			} catch (error) {
				const gqlError = getGraphQLError(`creating taste: ${name}`, error);
				if (gqlError.extensions?.code === 'CONFLICT') {
					message = `Taste with name '${name}' already exists`;
				} else {
					throw gqlError;
				}
			}

			return {
				success: !!createdTaste,
				taste: new Taste({ name }),
				message,
			};
		},
		updateTaste: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a taste');
			let updatedTaste = null;

			try {
				updatedTaste = await updateTaste({ name, updatedName });
			} catch (error) {
				throw getGraphQLError(`updating taste: ${name}`, error);
			}

			return {
				success: !!updatedTaste,
				taste: new Taste({ name: updatedName }),
				previousTaste: new Taste({ name }),
			};
		},
		deleteTaste: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a taste');
			let deletedTaste = null;

			try {
				deletedTaste = await deleteTaste(name);
			} catch (error) {
				throw getGraphQLError(`deleting taste: ${name}`, error);
			}

			return {
				success: !!deletedTaste,
				taste: new Taste({ name }),
			};
		},
		addTaste: async (_root, { input: { flavor, taste } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to add a taste');
			let addedTaste = null;

			try {
				addedTaste = await addTaste(new FlavorTaste(new Flavor({ name: flavor }), new Taste({ name: taste })));
			} catch (error) {
				throw getGraphQLError(`adding taste: ${taste} to flavor: ${flavor}`, error);
			}

			return {
				success: !!addedTaste,
				flavor: new Flavor({ name: flavor }),
				taste: new Taste({ name: taste }),
			};
		},
	},
};
