import { createTaste, deleteTaste, getTaste, getTastes, updateTaste } from '../../db/pairings/crud-taste';
import { Resolvers } from '../../generated/graphql';

export const resolvers: Resolvers = {
	Query: {
		taste: (_root, { name }) => getTaste(name),
		tastes: () => getTastes(),
	},
	Mutation: {
		createTaste: (_root, { name }) => createTaste({ name }),
		updateTaste: (_root, { input: { name, updatedName } }) => updateTaste({ name, updatedName }),
		deleteTaste: (_root, { name }) => deleteTaste(name),
	},
};
