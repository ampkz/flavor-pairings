import { Flavor as GqlFlavor, CreateFlavorInput } from '../generated/graphql';

export class Flavor implements GqlFlavor {
	public name: string;

	constructor(flavor: CreateFlavorInput) {
		this.name = flavor.name;
	}
}
