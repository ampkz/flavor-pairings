import { Node, Relationship } from '../_helpers/nodes';
import { Taste as GqlTaste } from '../generated/graphql';
import { Flavor } from './flavor';
import { NodeType, RelationshipType } from '../_helpers/nodes';

export class Taste implements GqlTaste {
	public name: string;

	constructor(taste: { name: string }) {
		this.name = taste.name;
	}
}

export class FlavorTaste {
	public flavor: Flavor;
	public taste: Taste;
	private _relationship: Relationship;

	constructor(flavor: Flavor, taste: Taste) {
		this.flavor = flavor;
		this.taste = taste;
		this._relationship = new Relationship(
			new Node(NodeType.FLAVOR, 'name', this.flavor.name),
			new Node(NodeType.TASTE, 'name', this.taste.name),
			RelationshipType.HAS
		);
	}

	getRelationship(): Relationship {
		return this._relationship;
	}
}
