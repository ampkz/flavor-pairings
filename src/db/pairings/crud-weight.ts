import { Node, NodeType, RelationshipType } from '../../_helpers/nodes';
import { UpdateFlavorInput } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorWeight, Weight } from '../../pairings/weight';
import { createNode, deleteNode, getNode, getNodes, updateNode } from '../utils/crud';
import { createRelationship, deleteRelationship, getRelationshipsToNode } from '../utils/relationship/crud-relationship';

export async function createWeight(weight: Weight): Promise<Weight | null> {
	const createdNode = await createNode(NodeType.WEIGHT, ['name: $name'], { name: weight.name });
	return createdNode ? new Weight(createdNode) : null;
}

export async function getWeight(name: string): Promise<Weight | null> {
	const matchedNode = await getNode(NodeType.WEIGHT, ['name: $name'], { name });
	return matchedNode ? new Weight(matchedNode) : null;
}

export async function updateWeight(updatedWeight: UpdateFlavorInput): Promise<Weight | null> {
	const updatedNode = await updateNode(NodeType.WEIGHT, 'w', ['name: $name'], ['w.name = $updatedName'], updatedWeight);
	return updatedNode ? new Weight(updatedNode) : null;
}

export async function deleteWeight(name: string): Promise<Weight | null> {
	const deletedNode = await deleteNode(NodeType.WEIGHT, ['name: $name'], { name });
	return deletedNode ? new Weight(deletedNode) : null;
}

export async function getWeights(): Promise<Weight[]> {
	const weights: Weight[] = [];

	const nodes = await getNodes(NodeType.WEIGHT, 'n.name ASC');

	weights.push(...nodes.map(node => new Weight(node)));

	return weights;
}

export async function addFlavorWeight(flavorWeight: FlavorWeight): Promise<Weight | null> {
	const [, w] = await createRelationship(flavorWeight.getRelationship());
	return w;
}

export async function removeFlavorWeight(flavorWeight: FlavorWeight): Promise<Weight | null> {
	const [, w] = await deleteRelationship(flavorWeight.getRelationship());
	return w;
}

export async function getFlavorWeights(flavor: Flavor): Promise<Weight[]> {
	const weights: Weight[] = [];

	const flavorNode = new Node(NodeType.FLAVOR, 'name', flavor.name);

	const nodes = await getRelationshipsToNode(flavorNode, NodeType.WEIGHT, RelationshipType.IS);

	weights.push(...nodes.map(node => new Weight(node[0])));

	return weights;
}
