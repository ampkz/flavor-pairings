import { Flavor } from './flavor';
import { type Path } from '../generated/graphql';

export class PairingPath implements Path {
	private _flavors: Flavor[] = [];

	constructor() {
		this._flavors = [];
	}

	public get flavors(): Flavor[] {
		return [...this._flavors];
	}

	public addFlavor(flavor: Flavor): void {
		this._flavors.push(flavor);
	}

	public hasFlavor(name: string): boolean {
		return this._flavors.some(f => f.name === name);
	}

	toString(): string {
		const pathLength = this._flavors.length;
		if (pathLength < 2) return '';
		let path = `${this._flavors[0]!.name}`;
		for (let i = 1; i < pathLength; i++) {
			path += ` -> ${this._flavors[i]!.name}`;
		}
		return path;
	}
}

export class ExperimentalPairings {
	private _pairingPaths: PairingPath[] = [];
	private _flavorSet: Set<string> = new Set();

	constructor() {}

	public get pairingPaths(): PairingPath[] {
		return [...this._pairingPaths];
	}

	public get uniqueFlavors(): Flavor[] {
		const flavors: Flavor[] = [];
		this._flavorSet.forEach((value: string) => flavors.push(new Flavor({ name: value })));
		return flavors;
	}

	public getPairingPathsFromFlavorName(flavorName: string): PairingPath[] {
		return this._pairingPaths.filter(path => path.hasFlavor(flavorName));
	}

	public addPairingPath(pairingPath: PairingPath): void {
		pairingPath.flavors.forEach(flavor => this._flavorSet.add(flavor.name));
		this._pairingPaths.push(pairingPath);
	}
}
