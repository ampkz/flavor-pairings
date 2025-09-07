import { Record } from 'neo4j-driver';
import { getSessionOptions } from '../../_helpers/db-helper';
import Config from '../../config/config';
import { ExperimentalPairings, PairingPath } from '../../pairings/experimental-pairing';
import { Flavor } from '../../pairings/flavor';
import { connect } from '../utils/connection';

export async function getExperimentalPairings(flavor1: Flavor, flavor2: Flavor, maxLength: number): Promise<ExperimentalPairings> {
	const experimentalPairings = new ExperimentalPairings();
	const driver = await connect();
	const session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	const match = await session.run(
		`MATCH p=(startNode)-[:PAIRS_WITH*1..${maxLength === 0 ? '1' : `${maxLength}`}]-(endNode) WHERE startNode.name = '${
			flavor1.name
		}' AND endNode.name = '${flavor2.name}' RETURN p;`
	);

	match.records.forEach((record: Record) => {
		const length = record.get('p').length;

		const segments = record.get('p').segments;
		let segment = segments[0];
		let pairingPath: PairingPath = new PairingPath();
		pairingPath.addFlavor(new Flavor({ name: segment.start.properties.name }));

		for (let i = 0; i < length; i++) {
			segment = segments[i];
			pairingPath.addFlavor(new Flavor({ name: segment.end.properties.name }));
		}
		experimentalPairings.addPairingPath(pairingPath);
	});

	await session.close();
	await driver.close();

	return experimentalPairings;
}
