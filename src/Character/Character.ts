// interface CharacterParams {
// 	name: string;
// 	key: string;
// 	sentiment: { [key:string]: number };
// 	memories: string[];
// }

export interface CharacterDto {
	name: string;
	key: string;
	sentiments: { [key:string]: number };
	memories: string[];
}

export class Character {
	name: string;
	key: string;
	sentiments: { [key:string]: number };
	memories: { [key:string]: string };

	constructor (params: CharacterDto) {
		const { name, key, sentiments, memories } = params;
		this.name = name;
		this.key = key;
		this.sentiments = sentiments;
		this.memories = memories.reduce((keyed: { [key:string]: string }, memory) => {
			keyed[memory] = memory;
			return keyed;
		}, {});
	}

	// clone (): Character {
	// 	return new Character({
	// 		name: this.name,
	// 		key: this.key,
	// 	});
	// }

	toDto (): CharacterDto {
		return {
			name: this.name,
			key: this.key,
			sentiments: { ...this.sentiments },
			memories: Object.values(this.memories),
		};
	}
}