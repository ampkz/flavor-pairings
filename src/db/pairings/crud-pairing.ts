import { Flavor } from '../../pairings/flavor';
import { Pairing } from '../../pairings/pairing';
import { createRelationship } from '../utils/relationship/crud-relationship';

export async function createPairing(pairing: Pairing): Promise<[Flavor | null, Flavor | null]> {
	const [f1, f2] = await createRelationship(pairing.getRelationship());

	if (f1 !== null && f2 !== null) {
		return [new Flavor(f1), new Flavor(f2)];
	}

	return [null, null];
}
