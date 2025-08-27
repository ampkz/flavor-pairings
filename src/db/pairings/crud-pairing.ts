import { Node, NodeType, RelationshipType } from '../../_helpers/nodes';
import { Flavor } from '../../pairings/flavor';
import { Pairing } from '../../pairings/pairing';
import { createRelationship, getRelationshipsToNode } from '../utils/relationship/crud-relationship';

export async function createPairing(pairing: Pairing): Promise<[Flavor | null, Flavor | null]> {
	const [f1, f2] = await createRelationship(pairing.getRelationship());

	if (f1 !== null && f2 !== null) {
		return [new Flavor(f1), new Flavor(f2)];
	}

	return [null, null];
}

export async function getFlavorPairings(flavor: Flavor): Promise<Flavor[]> {
	return await getRelationshipsToNode(new Node(NodeType.FLAVOR, 'name', flavor.name), NodeType.FLAVOR, RelationshipType.PAIRS_WITH, true);
}
