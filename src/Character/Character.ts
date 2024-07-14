export interface CharacterDto {
	name: string;
	key: string;
	sentiments: { [key:string]: number };
	memories: string[];
}

interface MemoryParams {
	memory: string;
}

interface SentimentParams {
	change: number;
	sentiment: string;
}

export class Character {
	#name: string;
	#key: string;
	#sentiments: { [key:string]: number };
	#memories: Set<string>;

	constructor (params: CharacterDto) {
		const { name, key, sentiments, memories } = params;
		this.#name = name;
		this.#key = key;
		this.#sentiments = sentiments;
		this.#memories = new Set(memories);
	}

	get name (): string {
		return this.#name;
	}

	get key (): string {
		return this.#key;
	}

	get sentiments (): { [key:string]: number } {
		return { ...this.#sentiments };
	}

	get memories (): string[] {
		return [...this.#memories];
	}

	// clone (): Character {
	// 	return new Character({
	// 		name: this.name,
	// 		key: this.key,
	// 	});
	// }

	updateSentiment (params: SentimentParams): void {
		const { sentiment, change } = params;
		this.#warnIfTooPrecise(change);

		this.#sentiments[sentiment] = this.#sentiments[sentiment] ?? 0;
		this.#sentiments[sentiment] = this.#correctMaths(this.#sentiments[sentiment] + change) ;
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
			sentiments: { ...this.sentiments },
			memories: [...this.memories],
		};
	}

	#correctMaths (n: number) {
		return Math.round(n * 1000) / 1000;
	}

	#warnIfTooPrecise (change: number) {
		const numberOfDecimals = +`${change}`.split('.')[1];
		if (numberOfDecimals > 3) {
			console.warn(`Math precision is only guaranteed to 3 decimal places.  Doing math on a number with ${numberOfDecimals} places`);
		}
	}
}