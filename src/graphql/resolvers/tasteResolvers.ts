import { addTaste, createTaste, deleteTaste, getTaste, getTastes, updateTaste } from '../../db/pairings/crud-taste';
import { Resolvers } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorTaste, Taste } from '../../pairings/taste';

export const resolvers: Resolvers = {
	Query: {
		taste: (_root, { name }) => getTaste(name),
		tastes: () => getTastes(),
	},
	Mutation: {
		createTaste: (_root, { name }) => createTaste({ name }),
		updateTaste: (_root, { input: { name, updatedName } }) => updateTaste({ name, updatedName }),
		deleteTaste: (_root, { name }) => deleteTaste(name),
		addTaste: (_root, { input: { flavor, taste } }) => addTaste(new FlavorTaste(new Flavor({ name: flavor }), new Taste({ name: taste }))),
	},
};
