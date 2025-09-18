import { Node, NodeType, RelationshipType } from '../../_helpers/nodes';
import { Paired } from '../../generated/graphql';
import { Flavor } from '../../pairings/flavor';
import { Pairing } from '../../pairings/pairing';
import { createRelationship, deleteRelationship, getRelationshipsToNode, updateRelationship } from '../utils/relationship/crud-relationship';

export async function createPairing(pairing: Pairing): Promise<Pairing | null> {
	if (pairing.flavor1.name === pairing.flavor2.name) return null;

	const [f1, f2, r] = await createRelationship(pairing.getRelationship());

	if (f1 !== null && f2 !== null && r !== null) {
		return new Pairing(new Flavor(f1), new Flavor(f2), r.affinity, r.especially || null);
	}

	return null;
}

export async function updatePairing(pairing: Pairing, updatedAffinity: string, updatedEspecially: string | null): Promise<Pairing | null> {
	const [f1, f2, r] = await updateRelationship(pairing.getRelationship(), ['affinity', 'especially'], {
		affinity: updatedAffinity,
		especially: updatedEspecially,
	});

	if (f1 !== null && f2 !== null && r !== null) {
		return new Pairing(new Flavor(f1), new Flavor(f2), r.affinity, r.especially || null);
	}

	return null;
}

export async function deletePairing(pairing: Pairing): Promise<Pairing | null> {
	const [f1, f2] = await deleteRelationship(pairing.getRelationship(), true);

	if (f1 !== null && f2 !== null) {
		return pairing;
	}

	return null;
}

export async function getFlavorPairings(flavor: Flavor, limit?: number | null, cursor?: string | null): Promise<Paired[]> {
	const pairings: Paired[] = [];

	const relationships = await getRelationshipsToNode(
		new Node(NodeType.FLAVOR, 'name', flavor.name),
		NodeType.FLAVOR,
		RelationshipType.PAIRS_WITH,
		true,
		'n2.name ASC',
		limit,
		`${cursor ? `n2.name > "${cursor}"` : ''}`
	);

	relationships.forEach(([n2, r]) => {
		pairings.push({ flavor: new Flavor(n2), affinity: r.affinity, especially: r.especially || null });
	});

	return pairings;
}
