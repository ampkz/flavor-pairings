import { addWeight, createWeight, deleteWeight, getWeight, getWeights, updateWeight } from '../../db/pairings/crud-weight';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorWeight, Weight } from '../../pairings/weight';

export const resolvers: Resolvers = {
	Query: {
		weight: (_root, { name }) => getWeight(name),
		weights: () => getWeights(),
	},
	Mutation: {
		createWeight: (_root, { name }) => createWeight({ name }),
		updateWeight: (_root, { input: { name, updatedName } }) => updateWeight({ name, updatedName }),
		deleteWeight: (_root, { name }) => deleteWeight(name),
		addWeight: (_root, { input: { flavor, weight } }) => addWeight(new FlavorWeight(new Flavor({ name: flavor }), new Weight({ name: weight }))),
	},
};
