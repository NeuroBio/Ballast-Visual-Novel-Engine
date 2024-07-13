import { Beat } from '../../../src/Beat/Beat';

export class SimpleBeat extends Beat {
	play = jest.fn();
}

export class FinalBeat extends Beat {
	play = jest.fn();
}