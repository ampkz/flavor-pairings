import { create } from 'domain';
import { Node, NodeType, Relationship, RelationshipType } from '../../_helpers/nodes';
import { UpdateFlavorInput } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { createNode, deleteNode, getNode, getNodes, updateNode } from '../utils/crud';
import { createRelationship, deleteRelationship, getRelationshipsToNode } from '../utils/relationship/crud-relationship';

export async function createFlavor(flavor: Flavor): Promise<Flavor | null> {
	const createdNode = await createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor.name });
	return createdNode ? new Flavor(createdNode) : null;
}

export async function getFlavor(name: string): Promise<Flavor | null> {
	const matchedNode = await getNode(NodeType.FLAVOR, ['name: $name'], { name });
	return matchedNode ? new Flavor(matchedNode) : null;
}

export async function setFlavorTips(flavor: Flavor, tips: string | null): Promise<Flavor | null> {
	const updatedNode = await updateNode(NodeType.FLAVOR, 'f', ['name: $name'], ['f.tips = $tips'], { name: flavor.name, tips });
	return updatedNode ? new Flavor(updatedNode) : null;
}

export async function getFlavorTips(flavor: Flavor): Promise<string | null> {
	const matchedNode = await getNode(NodeType.FLAVOR, ['name: $name'], { name: flavor.name });
	return matchedNode ? matchedNode.tips || null : null;
}

export async function updateFlavor(updatedFlavor: UpdateFlavorInput): Promise<Flavor | null> {
	const updatedNode = await updateNode(NodeType.FLAVOR, 'f', ['name: $name'], ['f.name = $updatedName'], updatedFlavor);
	return updatedNode ? new Flavor(updatedNode) : null;
}

export async function deleteFlavor(name: string): Promise<Flavor | null> {
	const deletedNode = await deleteNode(NodeType.FLAVOR, ['name: $name'], { name });
	return deletedNode ? new Flavor(deletedNode) : null;
}

export async function getFlavors(limit?: number | null, cursor?: string | null): Promise<Flavor[]> {
	const flavors: Flavor[] = [];

	const nodes = await getNodes(NodeType.FLAVOR, 'n.name ASC', limit, cursor ? 'n.name > "' + cursor + '"' : undefined);

	flavors.push(...nodes.map(node => new Flavor(node)));

	return flavors;
}

export async function getFlavorReference(flavor: Flavor): Promise<Flavor | null> {
	const reference = await getRelationshipsToNode(
		new Node(NodeType.FLAVOR, 'name', flavor.name),
		NodeType.FLAVOR,
		RelationshipType.REFERENCES,
		false
	);
	if (reference.length === 0) return null;
	return new Flavor(reference[0][0]);
}

export async function createFlavorReference(reference: Flavor, flavor: Flavor): Promise<[Flavor | null, Flavor | null]> {
	const relationship = new Relationship(
		new Node(NodeType.FLAVOR, 'name', reference.name),
		new Node(NodeType.FLAVOR, 'name', flavor.name),
		RelationshipType.REFERENCES
	);
	const [from, to] = await createRelationship(relationship);
	return [from ? reference : null, to ? flavor : null];
}

export async function deleteFlavorReference(reference: Flavor, flavor: Flavor): Promise<[Flavor | null, Flavor | null]> {
	const relationship = new Relationship(
		new Node(NodeType.FLAVOR, 'name', reference.name),
		new Node(NodeType.FLAVOR, 'name', flavor.name),
		RelationshipType.REFERENCES
	);
	const [from, to] = await deleteRelationship(relationship);
	return [from ? reference : null, to ? flavor : null];
}
