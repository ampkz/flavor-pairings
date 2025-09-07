import { getExperimentalPairings } from '../../db/pairings/experimental-pairing';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';

export const resolvers: Resolvers = {
	Query: {
		experimentalPairing: async (_root, { input: { flavor1, flavor2, maxLength } }) => {
			const exPairings = await getExperimentalPairings(new Flavor({ name: flavor1 }), new Flavor({ name: flavor2 }), maxLength!);
			return { uniqueFlavors: exPairings.uniqueFlavors, pairings: exPairings.getGraphQLPairings() };
		},
	},
};
