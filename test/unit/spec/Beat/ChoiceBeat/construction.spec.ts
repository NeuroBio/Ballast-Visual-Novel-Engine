import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';

const Error = Object.freeze({
	DEFAULT_REQUIRED: 'When all choices are conditional, a Default Behavior is required.',
	USE_SIMPLE_BEAT: 'When there is only one choice, data should be formatted as a simple beat, not a choice beat.',
});

describe(`ChoiceBeat.construction`, () => {
	describe(`beat has only one choice`, () => {
		it(`throws invalid error`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' } };
			const choices = [ choice1];

			expect(() => {
				new ChoiceBeat({ key: 'key', choices });
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
				new ChoiceBeat({ key: 'key', choices });
			}).not.toThrow();
		});
	});
	describe(`beat has a choice with a condition and character is set`, () => {
		it(`constructs without error`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' } };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => true] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' } };
			const choices = [ choice1, choice2, choice3];
			const character = 'character';

			expect(() => {
				new ChoiceBeat({ key: 'key', choices, character });
			}).not.toThrow();
		});
	});
	describe(`beat has all choices with conditions, and no default is set`, () => {
		it(`throws invalid error`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => false] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => false] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' }, conditions: [() => false] };
			const choices = [ choice1, choice2, choice3];
			const character = 'character';

			expect(() => {
				new ChoiceBeat({ key: 'key', choices, character });
			}).toThrow(Error.DEFAULT_REQUIRED);
		});
	});
	describe(`beat has all choices with conditions, and default is set`, () => {
		it(`constructs without error`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => false] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => false] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' }, conditions: [() => false] };
			const defaultBehavior = { text:'4', nextBeat: 'D' };
			const choices = [ choice1, choice2, choice3];
			const character = 'character';

			expect(() => {
				new ChoiceBeat({ key: 'key', choices, character, defaultBehavior });
			}).not.toThrow();
		});
	});
});
