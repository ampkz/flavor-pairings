import { addVolume, createVolume, deleteVolume, getVolume, getVolumes, updateVolume } from '../../db/pairings/crud-volume';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorVolume, Volume } from '../../pairings/volume';

export const resolvers: Resolvers = {
	Query: {
		volume: (_root, { name }) => getVolume(name),
		volumes: () => getVolumes(),
	},
	Mutation: {
		createVolume: (_root, { name }) => createVolume({ name }),
		updateVolume: (_root, { input: { name, updatedName } }) => updateVolume({ name, updatedName }),
		deleteVolume: (_root, { name }) => deleteVolume(name),
		addVolume: (_root, { input: { flavor, volume } }) => addVolume(new FlavorVolume(new Flavor({ name: flavor }), new Volume({ name: volume }))),
	},
};
