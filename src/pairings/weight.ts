import { Node, Relationship } from '../_helpers/nodes';
import { Weight as GqlWeight } from '../generated/graphql';
import { Flavor } from './flavor';
import { NodeType, RelationshipType } from '../_helpers/nodes';

export class Weight implements GqlWeight {
	public name: string;

	constructor(weight: { name: string }) {
		this.name = weight.name;
	}
}

export class FlavorWeight {
	public flavor: Flavor;
	public weight: Weight;
	private _relationship: Relationship;

	constructor(flavor: Flavor, weight: Weight) {
		this.flavor = flavor;
		this.weight = weight;
		this._relationship = new Relationship(
			new Node(NodeType.FLAVOR, 'name', this.flavor.name),
			new Node(NodeType.WEIGHT, 'name', this.weight.name),
			RelationshipType.IS
		);
	}

	getRelationship(): Relationship {
		return this._relationship;
	}
}
