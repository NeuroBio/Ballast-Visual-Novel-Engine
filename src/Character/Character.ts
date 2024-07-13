interface CharacterParams {
	name: string;
	key: string;
}

export interface CharacterDto {
	name: string;
	key: string;
}

export class Character {
	name: string;
	key: string;

	constructor (params: CharacterParams) {
		const { name, key } = params;
		this.name = name;
		this.key = key;
	}

	clone (): Character {
		return new Character({
			name: this.name,
			key: this.key,
		});
	}

	toDto (): CharacterDto {
		return {
			name: this.name,
			key: this.key,
		};
	}
}