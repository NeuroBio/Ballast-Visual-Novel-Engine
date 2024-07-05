interface CharacterParams {
	name: string;
}

export class Character {
	name: string;

	constructor (params: CharacterParams) {
		const { name } = params;
		this.name = name;
	}
}