import { Node, NodeType, Relationship, RelationshipType } from '../_helpers/nodes';
import { Flavor } from './flavor';

export class Pairing {
	public flavor1: Flavor;
	public flavor2: Flavor;
	private _relationship: Relationship;

	constructor(flavor1: Flavor, flavor2: Flavor) {
		this.flavor1 = flavor1;
		this.flavor2 = flavor2;
		this._relationship = new Relationship(
			new Node(NodeType.FLAVOR, 'name', this.flavor1.name),
			new Node(NodeType.FLAVOR, 'name', this.flavor2.name),
			RelationshipType.PAIRS_WITH
		);
	}

	getRelationship(): Relationship {
		return this._relationship;
	}
}
