export enum NodeType {
	FLAVOR = 'Flavor',
	TASTE = 'Taste',
	VOLUME = 'Volume',
	WEIGHT = 'Weight',
	TECHNIQUE = 'Technique',
}

export class Node {
	public idProp: string;
	public idValue: string;
	public nodeType: NodeType;

	constructor(nodeType: NodeType, idProp: string, idValue: string) {
		this.idProp = idProp;
		this.idValue = idValue;
		this.nodeType = nodeType;
	}

	getIdString(prefix: string = ''): string {
		return `${this.idProp}:$${prefix}${this.idProp}`;
	}

	getIdParams(prefix: string = '') {
		const params: any = {};

		params[`${prefix}${this.idProp}`] = this.idValue;

		return params;
	}
}

export enum RelationshipType {
	PAIRS_WITH = 'PAIRS_WITH',
	HAS = 'HAS',
	IS = 'IS',
	PREPARE_AS = 'PREPARE_AS',
}

export class Relationship {
	public node1: Node;
	public node2: Node;
	public type: RelationshipType;
	public idProps?: string[];
	public idValues?: string[];

	constructor(node1: Node, node2: Node, type: RelationshipType, idProp?: string[], idValue?: string[]) {
		this.node1 = node1;
		this.node2 = node2;
		this.type = type;
		if (idProp && idValue) {
			this.idProps = idProp;
			this.idValues = idValue;
		}
	}

	hasIdProp(): boolean {
		return !!this.idProps && !!this.idValues;
	}

	getIdString(prefix: string = ''): string {
		return this.idProps?.map(prop => `${prop}:$${prefix}${prop}`).join(', ') || '';
	}

	getIdParams(prefix: string = '') {
		const params: any = {};

		if (this.hasIdProp()) {
			this.idProps!.map((prop, index) => {
				params[`${prefix}${prop}`] = this.idValues![index];
			});
		}

		return params;
	}

	getRelationshipParams(n1Prefix: string, n2Prefix: string, rPrefix: string = '') {
		return {
			...this.getIdParams(rPrefix),
			...this.node1.getIdParams(n1Prefix),
			...this.node2.getIdParams(n2Prefix),
		};
	}
}
