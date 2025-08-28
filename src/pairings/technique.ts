import { Node, Relationship } from '../_helpers/nodes';
import { Technique as GqlTechnique } from '../generated/graphql';
import { Flavor } from './flavor';
import { NodeType, RelationshipType } from '../_helpers/nodes';

export class Technique implements GqlTechnique {
	public name: string;

	constructor(technique: { name: string }) {
		this.name = technique.name;
	}
}

export class FlavorTechnique {
	public flavor: Flavor;
	public technique: Technique;
	private _relationship: Relationship;

	constructor(flavor: Flavor, technique: Technique) {
		this.flavor = flavor;
		this.technique = technique;
		this._relationship = new Relationship(
			new Node(NodeType.FLAVOR, 'name', this.flavor.name),
			new Node(NodeType.TECHNIQUE, 'name', this.technique.name),
			RelationshipType.PREPARE_AS
		);
	}

	getRelationship(): Relationship {
		return this._relationship;
	}
}
