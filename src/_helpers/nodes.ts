export enum NodeType {
	FLAVOR = 'Flavor',
}

export class Node {
	public idProp: string;
	public idValue: string;
	public nodeType: NodeType;
	public shouldReturnFromQuery: boolean;

	constructor(nodeType: NodeType, idProp: string, idValue: string, shouldReturnFromQuery: boolean = false) {
		this.idProp = idProp;
		this.idValue = idValue;
		this.nodeType = nodeType;
		this.shouldReturnFromQuery = shouldReturnFromQuery;
	}

	getIdString(): string {
		return `${this.idProp}:$${this.idProp}`;
	}

	getIdParams() {
		const params: any = {};

		params[this.idProp] = this.idValue;

		return params;
	}
}

export enum RelationshipType {
	PAIRS_WITH = 'PAIRS_WITH',
}

export class Relationship {
	public node1: Node;
	public node2: Node;
	public name: RelationshipType;

	constructor(node1: Node, node2: Node, name: RelationshipType) {
		this.node1 = node1;
		this.node2 = node2;
		this.name = name;
	}

	getRelationshipParams() {
		return {
			...this.node1.getIdParams(),
			...this.node2.getIdParams(),
		};
	}
}
