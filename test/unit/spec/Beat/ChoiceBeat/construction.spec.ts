import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';

describe(`ChoiceBeat.construction`, () => {
	const Error = Object.freeze({
		DEFAULT_REQUIRED: 'When all choices are conditional, a Default Behavior is required.',
		USE_SIMPLE_BEAT: 'Choice beats require at least 2 choices.',
	});

	describe(`beat has no choices`, () => {
		it(`throws invalid error`, () => {
			expect(() => {
				new ChoiceBeat({ key: 'key', choices: [] });
			}).toThrow(Error.USE_SIMPLE_BEAT);
		});
	});
	describe(`beat has only one choice`, () => {
		it(`throws invalid error`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [] };
			const choices = [ choice1];

			expect(() => {
				new ChoiceBeat({ key: 'key', choices });
			}).toThrow(Error.USE_SIMPLE_BEAT);
		});
	});
	describe(`beat has choices without conditions and no character is set`, () => {
		it(`constructs without error`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' }, conditions: [] };
			const choices = [ choice1, choice2, choice3];

			expect(() => {
				new ChoiceBeat({ key: 'key', choices });
			}).not.toThrow();
		});
	});
	describe(`beat has a choice with a condition and character is set`, () => {
		it(`constructs without error`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => true] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' }, conditions: [] };
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
