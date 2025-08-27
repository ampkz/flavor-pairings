import { Taste as GqlTaste } from '../generated/graphql';

export class Taste implements GqlTaste {
	public name: string;

	constructor(taste: { name: string }) {
		this.name = taste.name;
	}
}
