import { Beat, PlayParams, StandardBeatDisplay } from './Beat';
import { SharedBeatParams } from './BeatFactory';

interface DefaultBehavior {
	text: string,
	character?: string,
	nextBeat: string,
}
interface SimpleBeatParams extends SharedBeatParams {
	defaultBehavior: DefaultBehavior;
}

export class SimpleBeat extends Beat {
	#defaultBehavior: DefaultBehavior;

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
}
