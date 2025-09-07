import { Record } from 'neo4j-driver';
import { getSessionOptions } from '../../_helpers/db-helper';
import Config from '../../config/config';
import { ExperimentalPairings } from '../../pairings/experimental-pairing';
import { Flavor } from '../../pairings/flavor';
import { connect } from '../utils/connection';
import { Pairing } from '../../pairings/pairing';

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

		for (let i = 0; i < length; i++) {
			let segment = segments[i];
			experimentalPairings.addPairing(
				new Pairing(
					new Flavor({ name: segment.start.properties.name }),
					new Flavor({ name: segment.end.properties.name }),
					segment.relationship.properties.affinity,
					segment.relationship.properties.especially || null
				)
			);
		}
	});

	await session.close();
	await driver.close();

	return experimentalPairings;
}
