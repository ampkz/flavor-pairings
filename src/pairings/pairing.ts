import { Node, NodeType, Relationship, RelationshipType } from '../_helpers/nodes';
import { PairingAffinity } from '../generated/graphql';
import { Flavor } from './flavor';

export class Pairing {
	public flavor1: Flavor;
	public flavor2: Flavor;
	public affinity: PairingAffinity;
	private _relationship: Relationship;
	private _especially: string | null;

	constructor(flavor1: Flavor, flavor2: Flavor, affinity: PairingAffinity, especially: string | null = null) {
		this.flavor1 = flavor1;
		this.flavor2 = flavor2;
		this.affinity = affinity;
		this._especially = especially;

		const idProps = ['affinity'];
		const idValues: string[] = [affinity];

		if (!!especially) {
			idProps.push('especially');
			idValues.push(especially);
		}

		this._relationship = new Relationship(
			new Node(NodeType.FLAVOR, 'name', this.flavor1.name),
			new Node(NodeType.FLAVOR, 'name', this.flavor2.name),
			RelationshipType.PAIRS_WITH,
			idProps,
			idValues
		);
	}

	getRelationship(): Relationship {
		return this._relationship;
	}
}
