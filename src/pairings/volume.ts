import { Node, Relationship } from '../_helpers/nodes';
import { Volume as GqlVolume } from '../generated/graphql';
import { Flavor } from './flavor';
import { NodeType, RelationshipType } from '../_helpers/nodes';

export class Volume implements GqlVolume {
	public name: string;

	constructor(volume: { name: string }) {
		this.name = volume.name;
	}
}

export class FlavorVolume {
	public flavor: Flavor;
	public volume: Volume;
	private _relationship: Relationship;

	constructor(flavor: Flavor, volume: Volume) {
		this.flavor = flavor;
		this.volume = volume;
		this._relationship = new Relationship(
			new Node(NodeType.FLAVOR, 'name', this.flavor.name),
			new Node(NodeType.VOLUME, 'name', this.volume.name),
			RelationshipType.HAS
		);
	}

	getRelationship(): Relationship {
		return this._relationship;
	}
}
