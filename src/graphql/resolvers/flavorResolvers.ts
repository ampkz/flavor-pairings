import { createFlavor, deleteFlavor, getFlavor, getFlavors, updateFlavor } from '../../db/pairings/crud-flavor';
import { Resolvers } from '../../generated/graphql';

export const resolvers: Resolvers = {
	Query: {
		flavor: (_root, { name }) => getFlavor(name),
		flavors: () => getFlavors(),
	},
	Mutation: {
		createFlavor: (_root, { input: { name } }) => createFlavor({ name }),
		updateFlavor: (_root, { input: { name, updatedName } }) => updateFlavor({ name, updatedName }),
		deleteFlavor: (_root, { name }) => deleteFlavor(name),
	},
	Flavor: {
		pairings: flavor => {
			if (flavor.name === 'Vanilla') {
				return [{ name: 'Coca Cola' }];
			}
			if (flavor.name === 'Chocolate') {
				return [{ name: 'Coffee' }];
			}
			return [];
		},
	},
};
