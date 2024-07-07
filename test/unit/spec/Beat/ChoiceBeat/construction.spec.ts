import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';
import { Fakes } from '../../../fakes/index';

const Error = Object.freeze({
	CHARACTER_REQUIRED: 'Cannot check for conditional choices without a Character.',
	DEFAULT_REQUIRED: 'When all choices are conditional, a Default Behavior is required.',
	USE_SIMPLE_BEAT: 'When there is only one choice, data should be formatted as a simple beat, not a choice beat.',
});

describe(`beat has only one choice`, () => {
	it(`throws invalid error`, () => {
		const choice1 = { beat: { text:'1', nextBeat: 'A' } };
		const choices = [ choice1];

		expect(() => {
			new ChoiceBeat({ choices });
		}).toThrow(Error.USE_SIMPLE_BEAT);
	});
});
describe(`beat has choices without conditions and no character is set`, () => {
	it(`constructs without error`, () => {
		const choice1 = { beat: { text:'1', nextBeat: 'A' } };
		const choice2 = { beat: { text:'2', nextBeat: 'B' } };
		const choice3 = { beat: { text:'3', nextBeat: 'C' } };
		const choices = [ choice1, choice2, choice3];

		expect(() => {
			new ChoiceBeat({ choices });
		}).not.toThrow();
	});
});
describe(`beat has a choice with a condition and no character is set`, () => {
	it(`throws invalid error`, () => {
		const choice1 = { beat: { text:'1', nextBeat: 'A' } };
		const choice2 = { beat: { text:'2', nextBeat: 'B' }, condition: () => true };
		const choice3 = { beat: { text:'3', nextBeat: 'C' } };
		const choices = [ choice1, choice2, choice3];

		expect(() => {
			new ChoiceBeat({ choices });
		}).toThrow(Error.CHARACTER_REQUIRED);
	});
});
describe(`beat has a choice with a condition and character is set`, () => {
	it(`constructs without error`, () => {
		const choice1 = { beat: { text:'1', nextBeat: 'A' } };
		const choice2 = { beat: { text:'2', nextBeat: 'B' }, condition: () => true };
		const choice3 = { beat: { text:'3', nextBeat: 'C' } };
		const choices = [ choice1, choice2, choice3];
		const character = new Fakes.Character('name');

		expect(() => {
			new ChoiceBeat({ choices, character });
		}).not.toThrow();
	});
});
describe(`beat has all choices with conditions, and no default is set`, () => {
	it(`throws invalid error`, () => {
		const choice1 = { beat: { text:'1', nextBeat: 'A' }, condition: () => false };
		const choice2 = { beat: { text:'2', nextBeat: 'B' }, condition: () => false };
		const choice3 = { beat: { text:'3', nextBeat: 'C' }, condition: () => false };
		const choices = [ choice1, choice2, choice3];
		const character = new Fakes.Character('name');

		expect(() => {
			new ChoiceBeat({ choices, character });
		}).toThrow(Error.DEFAULT_REQUIRED);
	});
});
describe(`beat has all choices with conditions, and default is set`, () => {
	it(`constructs without error`, () => {
		const choice1 = { beat: { text:'1', nextBeat: 'A' }, condition: () => false };
		const choice2 = { beat: { text:'2', nextBeat: 'B' }, condition: () => false };
		const choice3 = { beat: { text:'3', nextBeat: 'C' }, condition: () => false };
		const defaultBehavior = { text:'4', nextBeat: 'D' };
		const choices = [ choice1, choice2, choice3];
		const character = new Fakes.Character('name');

		expect(() => {
			new ChoiceBeat({ choices, character, defaultBehavior });
		}).not.toThrow();
	});
});