import { Record } from 'neo4j-driver';
import { getSessionOptions } from './_helpers/db-helper';
import Config from './config/config';
import { connect } from './db/utils/connection';
import startServer from './server/server';
import dotenv from 'dotenv';
import { Flavor } from './pairings/flavor';
import { ExperimentalPairings, PairingPath } from './pairings/experimental-pairing';

dotenv.config();

(async () => {
	const driver = await connect();
	const session = driver.session(getSessionOptions(Config.PAIRINGS_DB));

	const match = await session.run(`MATCH p=(startNode)-[:PAIRS_WITH*1..4]-(endNode)
WHERE startNode.name = 'african cuisine' AND endNode.name = 'allspice'
RETURN p;`);

	const experimentalPairings: ExperimentalPairings = new ExperimentalPairings();

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

	console.log(
		`paths for ${experimentalPairings.uniqueFlavors[3]}`,
		String(experimentalPairings.getPairingPathsFromFlavorName(experimentalPairings.uniqueFlavors[3]!))
	);

	await session.close();
	await driver.close();

	const app = await startServer();
	app.listen(Config.PORT, () => {
		console.log(`[server]: Node environment is: ${process.env.NODE_ENV}`);
		console.log(`[server]: Server is running at http://localhost:${Config.PORT}/`);
		console.log(`[server]: Graphql endpoint at http://localhost:${Config.PORT}/graphql`);
	});
})();
