import { addVolume, createVolume, deleteVolume, getVolume, getVolumes, updateVolume } from '../../db/pairings/crud-volume';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorVolume, Volume } from '../../pairings/volume';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { isPermitted } from '../../_helpers/auth-helper';
import { unauthorizedError, getGraphQLError } from '../errors/errors';

export const resolvers: Resolvers = {
	Query: {
		volume: (_root, { name }) => getVolume(name),
		volumes: () => getVolumes(),
	},
	Mutation: {
		createVolume: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a volume');
			let createdVolume = null;
			let message: string | null = null;

			try {
				createdVolume = await createVolume({ name });
			} catch (error) {
				const gqlError = getGraphQLError(`creating volume: ${name}`, error);
				if (gqlError.extensions?.code === 'CONFLICT') {
					message = `Volume with name '${name}' already exists`;
				} else {
					throw gqlError;
				}
			}

			return {
				success: !!createdVolume,
				volume: new Volume({ name }),
				message,
			};
		},
		updateVolume: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a volume');
			let updatedVolume = null;

			try {
				updatedVolume = await updateVolume({ name, updatedName });
			} catch (error) {
				throw getGraphQLError(`updating volume: ${name}`, error);
			}

			return {
				success: !!updatedVolume,
				volume: new Volume({ name: updatedName }),
				previousVolume: new Volume({ name }),
			};
		},
		deleteVolume: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a volume');
			let deletedVolume = null;

			try {
				deletedVolume = await deleteVolume(name);
			} catch (error) {
				throw getGraphQLError(`deleting volume: ${name}`, error);
			}

			return {
				success: !!deletedVolume,
				volume: new Volume({ name }),
			};
		},
		addVolume: async (_root, { input: { flavor, volume } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to add a volume');
			let addedVolume = null;

			try {
				addedVolume = await addVolume(new FlavorVolume(new Flavor({ name: flavor }), new Volume({ name: volume })));
			} catch (error) {
				throw getGraphQLError(`adding volume: ${volume} to flavor: ${flavor}`, error);
			}

			return {
				success: !!addedVolume,
				flavor: new Flavor({ name: flavor }),
				volume: new Volume({ name: volume }),
			};
		},
	},
};
