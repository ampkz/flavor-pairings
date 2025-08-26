import { NodeType } from '../../_helpers/nodes';
import { Flavor } from '../../pairings/flavor';
import { createNode, getNode } from '../utils/crud';

export async function createFlavor(flavor: Flavor): Promise<Flavor | null> {
	const createdNode = await createNode(NodeType.FLAVOR, ['name: $name'], { name: flavor.name });
	return createdNode ? new Flavor(createdNode) : null;
}

export async function getFlavor(name: string): Promise<Flavor | null> {
	const matchedNode = await getNode(NodeType.FLAVOR, ['name: $name'], { name });
	return matchedNode ? new Flavor(matchedNode) : null;
}
