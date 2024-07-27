export class Character {
	#name;
	#key;
	#traits;
	#memories;
	constructor (params) {
		const { name, key, traits, memories } = params;
		this.#name = name;
		this.#key = key;
		this.#traits = traits;
		this.#memories = new Set(memories);
	}
	get name () {
		return this.#name;
	}
	get key () {
		return this.#key;
	}
	get traits () {
		return { ...this.#traits };
	}
	hasMemory (memory) {
		return this.#memories.has(memory);
	}
	updateTrait (params) {
		const { trait, change } = params;
		this.#warnIfTooPrecise(change);
		this.#traits[trait] = this.#traits[trait] ?? 0;
		this.#traits[trait] = this.#correctMaths(this.#traits[trait] + change);
	}
	addMemory (params) {
		const { memory } = params;
		this.#memories.add(memory);
	}
	removeMemory (params) {
		const { memory } = params;
		this.#memories.delete(memory);
	}
	toDto () {
		return {
			name: this.name,
			key: this.key,
			traits: { ...this.#traits },
			memories: [...this.#memories],
		};
	}
	clone () {
		return new Character(this.toDto());
	}
	#correctMaths (n) {
		return Math.round(n * 1000) / 1000;
	}
	#warnIfTooPrecise (change) {
		const numberOfDecimals = `${change}`.split('.')[1].length;
		if (numberOfDecimals > 3) {
			console.warn(`Math precision is only guaranteed to 3 decimal places.  Doing math on a number with ${numberOfDecimals} places`);
		}
	}
}
