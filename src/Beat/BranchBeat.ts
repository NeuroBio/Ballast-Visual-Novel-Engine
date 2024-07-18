import { Beat, PlayParams, StandardBeatDisplay } from './Beat';

interface BranchBeatParams {
	// choices: ChoiceOption[];
	key: string;
	character?: string;
}

export class BranchBeat extends Beat {
// 	#choices: ChoiceOption[];
	#character: string | undefined;

	constructor (params: BranchBeatParams) {
		const { character } = params;
		super(params);

		this.#character = character;
	}

	play (params: PlayParams): StandardBeatDisplay {
		const { characters } = params;
		const character = this.getCharacter({
			character: this.#character,
			characters,
		});
		return {
			text: `${character}: `,
			nextBeat: '',
		};
	}
}
