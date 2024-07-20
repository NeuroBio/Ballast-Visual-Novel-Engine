import { Beat, PlayParams, StandardBeatDisplay } from './Beat';
import { SharedBeatParams } from './BeatFactory';

interface BestFitBranchBeatParams extends SharedBeatParams {

}

export class BestFitBranchBeat extends Beat {
	constructor (params: BestFitBranchBeatParams) {
		super(params);
	}

	play (params: PlayParams): StandardBeatDisplay {
		console.log(params);
		return { text: '', nextBeat: '' };
	}
}