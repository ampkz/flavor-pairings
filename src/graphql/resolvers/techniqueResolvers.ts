import { addTechnique, createTechnique, deleteTechnique, getTechnique, getTechniques, updateTechnique } from '../../db/pairings/crud-technique';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorTechnique, Technique } from '../../pairings/technique';

export const resolvers: Resolvers = {
	Query: {
		technique: (_root, { name }) => getTechnique(name),
		techniques: () => getTechniques(),
	},
	Mutation: {
		createTechnique: (_root, { name }) => createTechnique({ name }),
		updateTechnique: (_root, { input: { name, updatedName } }) => updateTechnique({ name, updatedName }),
		deleteTechnique: (_root, { name }) => deleteTechnique(name),
		addTechnique: (_root, { input: { flavor, technique } }) =>
			addTechnique(new FlavorTechnique(new Flavor({ name: flavor }), new Technique({ name: technique }))),
	},
};
