import { addVolume, createVolume, deleteVolume, getVolume, getVolumes, updateVolume } from '../../db/pairings/crud-volume';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorVolume, Volume } from '../../pairings/volume';
import { Auth } from '@ampkz/auth-neo4j/auth';
import { isPermitted } from '../../_helpers/auth-helper';
import { unauthorizedError } from '../errors/errors';

export const resolvers: Resolvers = {
	Query: {
		volume: (_root, { name }) => getVolume(name),
		volumes: () => getVolumes(),
	},
	Mutation: {
		createVolume: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to create a volume');
			return createVolume({ name });
		},
		updateVolume: async (_root, { input: { name, updatedName } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to update a volume');
			return updateVolume({ name, updatedName });
		},
		deleteVolume: async (_root, { name }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to delete a volume');
			return deleteVolume(name);
		},
		addVolume: async (_root, { input: { flavor, volume } }, { authorizedUser }) => {
			if (!isPermitted(authorizedUser, Auth.ADMIN, Auth.CONTRIBUTOR)) throw unauthorizedError('You are not authorized to add a volume');
			return addVolume(new FlavorVolume(new Flavor({ name: flavor }), new Volume({ name: volume })));
		},
	},
};
