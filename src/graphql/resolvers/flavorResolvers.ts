import { Resolvers } from '../../generated/graphql';

export const resolvers: Resolvers = {
	Query: {
		flavor: (_root, { name }) => {
			return { name: name };
		},
		flavors: () => {
			return [{ name: 'Vanilla' }, { name: 'Chocolate' }];
		},
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
