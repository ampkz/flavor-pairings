import {
	addFlavorTechnique,
	createTechnique,
	deleteTechnique,
	getTechnique,
	getTechniques,
	removeFlavorTechnique,
	updateTechnique,
} from '../../db/pairings/crud-technique';
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
			let message: string | null = null;
			try {
				createdTechnique = await createTechnique({ name });
			} catch (error) {
				const gqlError = getGraphQLError(`creating technique: ${name}`, error);
				if (gqlError.extensions?.code === 'CONFLICT') {
					message = `Technique with name '${name}' already exists`;
				} else {
					throw gqlError;
				}
			}

			return {
				success: !!createdTechnique,
				technique: new Technique({ name }),
				message,
			};
		},
		updateTechnique: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a technique');
			let updatedTechnique = null;

			try {
				updatedTechnique = await updateTechnique({ name, updatedName });
			} catch (error) {
				throw getGraphQLError(`updating technique: ${name}`, error);
			}

			return {
				success: !!updatedTechnique,
				technique: new Technique({ name: updatedName }),
				previousTechnique: new Technique({ name }),
			};
		},
		deleteTechnique: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a technique');
			let deletedTechnique = null;

			try {
				deletedTechnique = await deleteTechnique(name);
			} catch (error) {
				throw getGraphQLError(`deleting technique: ${name}`, error);
			}

			return {
				success: !!deletedTechnique,
				technique: new Technique({ name }),
			};
		},
		addFlavorTechnique: async (_root, { input: { flavor, technique } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to add a technique');
			let addedTechnique = null;

			try {
				addedTechnique = await addFlavorTechnique(new FlavorTechnique(new Flavor({ name: flavor }), new Technique({ name: technique })));
			} catch (error) {
				throw getGraphQLError(`adding technique: ${technique} to flavor: ${flavor}`, error);
			}

			return {
				success: !!addedTechnique,
				flavor: new Flavor({ name: flavor }),
				technique: new Technique({ name: technique }),
			};
		},
		removeFlavorTechnique: async (_root, { input: { flavor, technique } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to remove a technique');
			let removedTechnique = null;

			try {
				removedTechnique = await removeFlavorTechnique(new FlavorTechnique(new Flavor({ name: flavor }), new Technique({ name: technique })));
			} catch (error) {
				throw getGraphQLError(`removing technique: ${technique} from flavor: ${flavor}`, error);
			}

			return {
				success: !!removedTechnique,
				flavor: new Flavor({ name: flavor }),
				technique: new Technique({ name: technique }),
			};
		},
	},
};
