import { Node, NodeType, RelationshipType } from '../../_helpers/nodes';
import { UpdateFlavorInput } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { FlavorVolume, Volume } from '../../pairings/volume';
import { createNode, deleteNode, getNode, getNodes, updateNode } from '../utils/crud';
import { createRelationship, getRelationshipsToNode } from '../utils/relationship/crud-relationship';

export async function createVolume(volume: Volume): Promise<Volume | null> {
	const createdNode = await createNode(NodeType.VOLUME, ['name: $name'], { name: volume.name });
	return createdNode ? new Volume(createdNode) : null;
}

export async function getVolume(name: string): Promise<Volume | null> {
	const matchedNode = await getNode(NodeType.VOLUME, ['name: $name'], { name });
	return matchedNode ? new Volume(matchedNode) : null;
}

export async function updateVolume(updatedVolume: UpdateFlavorInput): Promise<Volume | null> {
	const updatedNode = await updateNode(NodeType.VOLUME, 'v', ['name: $name'], ['v.name = $updatedName'], updatedVolume);
	return updatedNode ? new Volume(updatedNode) : null;
}

export async function deleteVolume(name: string): Promise<Volume | null> {
	const deletedNode = await deleteNode(NodeType.VOLUME, ['name: $name'], { name });
	return deletedNode ? new Volume(deletedNode) : null;
}

export async function getVolumes(): Promise<Volume[]> {
	const volumes: Volume[] = [];

	const nodes = await getNodes(NodeType.VOLUME, 'n.name ASC');

	volumes.push(...nodes.map(node => new Volume(node)));

	return volumes;
}

export async function addVolume(flavorVolume: FlavorVolume): Promise<Volume | null> {
	const [, v] = await createRelationship(flavorVolume.getRelationship());
	return v;
}

export async function getFlavorVolumes(flavor: Flavor): Promise<Volume[]> {
	const volumes: Volume[] = [];

	const flavorNode = new Node(NodeType.FLAVOR, 'name', flavor.name);

	const nodes = await getRelationshipsToNode(flavorNode, NodeType.VOLUME, RelationshipType.IS);

	volumes.push(...nodes.map(node => new Volume(node[0])));

	return volumes;
}
