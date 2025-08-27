import { NodeType } from '../../_helpers/nodes';
import { UpdateFlavorInput } from '../../generated/graphql';
import { FlavorTaste, Taste } from '../../pairings/taste';
import { createNode, deleteNode, getNode, getNodes, updateNode } from '../utils/crud';
import { createRelationship } from '../utils/relationship/crud-relationship';

export async function createTaste(taste: Taste): Promise<Taste | null> {
	const createdNode = await createNode(NodeType.TASTE, ['name: $name'], { name: taste.name });
	return createdNode ? new Taste(createdNode) : null;
}

export async function getTaste(name: string): Promise<Taste | null> {
	const matchedNode = await getNode(NodeType.TASTE, ['name: $name'], { name });
	return matchedNode ? new Taste(matchedNode) : null;
}

export async function updateTaste(updatedTaste: UpdateFlavorInput): Promise<Taste | null> {
	const updatedNode = await updateNode(NodeType.TASTE, 'f', ['name: $name'], ['f.name = $updatedName'], updatedTaste);
	return updatedNode ? new Taste(updatedNode) : null;
}

export async function deleteTaste(name: string): Promise<Taste | null> {
	const deletedNode = await deleteNode(NodeType.TASTE, ['name: $name'], { name });
	return deletedNode ? new Taste(deletedNode) : null;
}

export async function getTastes(): Promise<Taste[]> {
	const tastes: Taste[] = [];

	const nodes = await getNodes(NodeType.TASTE, 'n.name ASC');

	tastes.push(...nodes.map(node => new Taste(node)));

	return tastes;
}

export async function addTaste(flavorTaste: FlavorTaste): Promise<Taste | null> {
	const [, t] = await createRelationship(flavorTaste.getRelationship());
	return t;
}
