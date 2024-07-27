export interface CharacterDto {
	name: string;
	key: string;
	traits: { [key:string]: number };
	memories: string[];
}

interface MemoryParams {
	memory: string;
}

interface TraitParams {
	change: number;
	trait: string;
}

export class Character {
	#name: string;
	#key: string;
	#traits: { [key:string]: number };
	#memories: Set<string>;

	constructor (params: CharacterDto) {
		const { name, key, traits, memories } = params;
		this.#name = name;
		this.#key = key;
		this.#traits = traits;
		this.#memories = new Set(memories);
	}

	get name (): string {
		return this.#name;
	}

	get key (): string {
		return this.#key;
	}

	get traits (): { [key:string]: number } {
		return { ...this.#traits };
	}

	hasMemory (memory: string): boolean {
		return this.#memories.has(memory);
	}

	updateTrait (params: TraitParams): void {
		const { trait, change } = params;
		this.#warnIfTooPrecise(change);

		this.#traits[trait] = this.#traits[trait] ?? 0;
		this.#traits[trait] = this.#correctMaths(this.#traits[trait] + change) ;
	}

	addMemory (params: MemoryParams): void {
		const { memory } = params;
		this.#memories.add(memory);
	}

	removeMemory (params: MemoryParams): void {
		const { memory } = params;
		this.#memories.delete(memory);
	}

	toDto (): CharacterDto {
		return {
			name: this.name,
			key: this.key,
			traits: { ...this.#traits },
			memories: [...this.#memories],
		};
	}

	clone (): Character {
		return new Character(this.toDto());
	}

	#correctMaths (n: number) {
		return Math.round(n * 1000) / 1000;
	}

	#warnIfTooPrecise (change: number) {
		const numberOfDecimals = `${change}`.split('.')[1].length;
		if (numberOfDecimals > 3) {
			console.warn(`Math precision is only guaranteed to 3 decimal places.  Doing math on a number with ${numberOfDecimals} places`);
		}
	}
}