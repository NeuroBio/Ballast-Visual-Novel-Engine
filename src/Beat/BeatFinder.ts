import { BeatData } from '../../test/unit/FakeData/TestData';
import { Beat } from './Beat';
import { BeatFactory } from './BeatFactory';

interface BeatFinderParams {
	beatFactory: BeatFactory,
}

export class BeatFinder {
	#beatFactory: BeatFactory;
	constructor (params: BeatFinderParams) {
		this.#beatFactory = params.beatFactory || new BeatFactory();
	}

	byKey (beatKey: string): Beat {
		const data = BeatData.find((x) => (x.key === beatKey));
		return this.#beatFactory.fromDto(data!);
	}
}
