import { NodeType } from '../../_helpers/nodes';
import { UpdateFlavorInput } from '../../generated/graphql';
import { FlavorTechnique, Technique } from '../../pairings/technique';
import { createNode, deleteNode, getNode, getNodes, updateNode } from '../utils/crud';
import { createRelationship } from '../utils/relationship/crud-relationship';

export async function createTechnique(technique: Technique): Promise<Technique | null> {
	const createdNode = await createNode(NodeType.TECHNIQUE, ['name: $name'], { name: technique.name });
	return createdNode ? new Technique(createdNode) : null;
}

export async function getTechnique(name: string): Promise<Technique | null> {
	const matchedNode = await getNode(NodeType.TECHNIQUE, ['name: $name'], { name });
	return matchedNode ? new Technique(matchedNode) : null;
}

export async function updateTechnique(updatedTechnique: UpdateFlavorInput): Promise<Technique | null> {
	const updatedNode = await updateNode(NodeType.TECHNIQUE, 'tq', ['name: $name'], ['tq.name = $updatedName'], updatedTechnique);
	return updatedNode ? new Technique(updatedNode) : null;
}

export async function deleteTechnique(name: string): Promise<Technique | null> {
	const deletedNode = await deleteNode(NodeType.TECHNIQUE, ['name: $name'], { name });
	return deletedNode ? new Technique(deletedNode) : null;
}

export async function getTechniques(): Promise<Technique[]> {
	const techniques: Technique[] = [];

	const nodes = await getNodes(NodeType.TECHNIQUE, 'n.name ASC');

	techniques.push(...nodes.map(node => new Technique(node)));

	return techniques;
}

export async function addTechnique(flavorTechnique: FlavorTechnique): Promise<Technique | null> {
	const [, tq] = await createRelationship(flavorTechnique.getRelationship());
	return tq;
}
