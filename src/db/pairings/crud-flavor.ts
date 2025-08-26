import { NodeType } from '../../_helpers/nodes';
import { UpdateFlavorInput } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { createNode, deleteNode, getNode, updateNode } from '../utils/crud';

export async function createFlavor(flavor: Flavor): Promise<Flavor | null> {
	const createdNode = await createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor.name });
	return createdNode ? new Flavor(createdNode) : null;
}

export async function getFlavor(name: string): Promise<Flavor | null> {
	const matchedNode = await getNode(NodeType.FLAVOR, ['name: $name'], { name });
	return matchedNode ? new Flavor(matchedNode) : null;
}

export async function updateFlavor(updatedFlavor: UpdateFlavorInput): Promise<Flavor | null> {
	const updatedNode = await updateNode(NodeType.FLAVOR, 'f', ['name: $name'], ['f.name = $updatedName'], updatedFlavor);
	return updatedNode ? new Flavor(updatedNode) : null;
}

export async function deleteFlavor(name: string): Promise<Flavor | null> {
	const deletedNode = await deleteNode(NodeType.FLAVOR, ['name: $name'], { name });
	return deletedNode ? new Flavor(deletedNode) : null;
}
