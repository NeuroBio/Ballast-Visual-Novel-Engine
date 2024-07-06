import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';
import { Fakes } from '../../../fakes/index';

describe(`ChoiceBeat.play`, () => {
	describe(`beat has three choices without conditions`, () => {
		it(`returns all three choice beats`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' } };
			const choice2 = { beat: { text:'2', nextBeat: 'B' } };
			const choice3 = { beat: { text:'3', nextBeat: 'C' } };
			const choices = [ choice1, choice2, choice3];

			const beat = new ChoiceBeat({ choices });
			expect(beat.play()).toEqual({ choices: choices.map(x => x.beat) });
		});
	});
	describe(`beat has two choices with a condition, character is set and all conditions met`, () => {
		it(`returns all three choice beats`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, allow: () => true };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, allow: () => true };
			const choice3 = { beat: { text:'3', nextBeat: 'C' } };
			const choices = [ choice1, choice2, choice3];
			const character = new Fakes.Character('name');

			const beat = new ChoiceBeat({ choices, character });
			expect(beat.play()).toEqual({ choices: choices.map(x => x.beat) });
		});
	});
	describe(`beat has two choices with a condition, character is set and second condition not met`, () => {
		it(`returns first and last choice beats`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, allow: () => true };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, allow: () => false };
			const choice3 = { beat: { text:'3', nextBeat: 'C' } };
			const choices = [ choice1, choice2, choice3];
			const character = new Fakes.Character('name');

			const beat = new ChoiceBeat({ choices, character });
			expect(beat.play()).toEqual({ choices: [ choice1.beat, choice3.beat ] });
		});
	});
	describe(`beat has two choices with conditions, character is set and no condition is met`, () => {
		it(`returns last choice beat as a simple beat display`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, allow: () => false };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, allow: () => false };
			const choice3 = { beat: { text:'3', nextBeat: 'C' } };
			const defaultBehavior = { text:'4', nextBeat: 'D' };
			const choices = [ choice1, choice2, choice3];
			const character = new Fakes.Character('name');

			const beat = new ChoiceBeat({ choices, character, defaultBehavior });
			expect(beat.play()).toEqual(choice3.beat);
		});
	});
	describe(`beat has all choices with conditions, character is set and no condition is met`, () => {
		it(`returns default behavior as a simple beat display`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, allow: () => false };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, allow: () => false };
			const choice3 = { beat: { text:'3', nextBeat: 'C' }, allow: () => false };
			const defaultBehavior = { text:'4', nextBeat: 'D' };
			const choices = [ choice1, choice2, choice3];
			const character = new Fakes.Character('name');

			const beat = new ChoiceBeat({ choices, character, defaultBehavior });
			expect(beat.play()).toEqual(defaultBehavior);
		});
	});
});

