import { Beat, PlayParams, StandardBeatDisplay } from './Beat';
import { DefaultBehaviorStandard, SaveDataSideEffects } from './SharedInterfaces';

export interface SimpleBeatParams {
	key: string;
	defaultBehavior: DefaultBehaviorStandard;
	saveData: SaveDataSideEffects;
}

export class SimpleBeat extends Beat {
	#defaultBehavior: DefaultBehaviorStandard;

	constructor (params: SimpleBeatParams) {
		const { defaultBehavior } = params;
		super(params);

		this.#defaultBehavior = defaultBehavior;
	}

	play (params: PlayParams): StandardBeatDisplay {
		const { characters } = params;
		return this.assembleStandardBeatDisplay({
			beat: this.#defaultBehavior,
			characters,
		});
	}

	nextBeats (): string[] {
		return [this.#defaultBehavior.nextBeat];
	}
}
