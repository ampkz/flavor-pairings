import { Flavor } from './flavor';
import { Pairing } from '../generated/graphql';

export class PairingPath {
	private _pairings: Pairing[] = [];

	constructor() {
		this._pairings = [];
	}

	public get pairings(): Pairing[] {
		return [...this._pairings];
	}

	public addPairing(pairing: Pairing): void {
		this._pairings.push(pairing);
	}

	// public getGraphQLPairings(): GqlPairing[] {
	// 	return this._pairings.map(pairing => ({
	// 		flavor: { name: pairing.flavor1.name },
	// 		paired: { flavor: { name: pairing.flavor2.name }, affinity: pairing.affinity, especially: pairing.especially },
	// 	}));
	// }
}

export class ExperimentalPairings {
	private _paths: PairingPath[] = [];
	private _flavorSet: Set<string> = new Set();

	constructor() {}

	public get paths(): PairingPath[] {
		return [...this._paths];
	}

	public get uniqueFlavors(): Flavor[] {
		const flavors: Flavor[] = [];
		this._flavorSet.forEach((value: string) => flavors.push(new Flavor({ name: value })));
		return flavors;
	}

	// public getPairingPathsFromFlavorName(flavorName: string): PairingPath[] {
	// 	return this._pairingPaths.filter(path => path.hasFlavor(flavorName));
	// }

	public addPath(path: PairingPath) {
		path.pairings.forEach(pairing => {
			this._flavorSet.add(pairing.flavor.name);
			this._flavorSet.add(pairing.paired.flavor.name);
		});
		this._paths.push(path);
	}

	// public addPairing(pairing: Pairing): void {
	// 	this._flavorSet.add(pairing.flavor1.name);
	// 	this._flavorSet.add(pairing.flavor2.name);
	// 	this._paths.push(pairing);
	// }
}
