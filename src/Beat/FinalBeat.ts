import { Beat, FinalBeatDisplay, PlayParams } from './Beat';
import { DisplaySideEffects, SaveDataSideEffects } from './SharedInterfaces';

interface DefaultBehavior {
	text: string;
	character?: string;
	sceneData: DisplaySideEffects;
}

export interface FinalBeatParams {
	key: string;
	defaultBehavior: {
		text: string;
		character?: string;
		sceneData: DisplaySideEffects;
	};
	saveData: SaveDataSideEffects;
}

export class FinalBeat extends Beat {
	#defaultBehavior: DefaultBehavior;

	constructor (params: FinalBeatParams) {
		const { defaultBehavior } = params;
		super(params);

		this.#defaultBehavior = defaultBehavior;
	}

	play (params: PlayParams): FinalBeatDisplay {
		const { characters } = params;
		const character = this.getCharacter({
			character: this.#defaultBehavior.character,
			characters,
		});
		return {
			text: this.#defaultBehavior.text,
			speaker: character,
			saveData: this.createSaveDataSideEffects(),
			sceneData: this.#defaultBehavior.sceneData,
		};
	}
}
