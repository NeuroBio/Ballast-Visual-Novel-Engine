import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../FakeData/TestData';

describe(`ChoiceBeat.play`, () => {
	const keyedCharacters = CharacterData.reduce((keyed: { [key: string]: Character}, char) => {
		keyed[char.key] = new Character(char);
		return keyed;
	}, {});
	describe(`beat has three choices without conditions`, () => {
		it(`returns all three choice beats`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' } };
			const choice2 = { beat: { text:'2', nextBeat: 'B' } };
			const choice3 = { beat: { text:'3', nextBeat: 'C' } };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices });
			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({ choices: choices.map(x => x.beat) });
		});
	});
	describe(`beat has two choices with a condition, character is set, and all conditions met`, () => {
		it(`returns all three choice beats`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => true] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => true] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' } };
			const choices = [ choice1, choice2, choice3];
			const character = CharacterData[0].key;
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, character });
			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({ choices: choices.map(x => x.beat) });
		});
	});
	describe(`beat has two choices with a condition, character is set, and second condition not met`, () => {
		it(`returns first and last choice beats`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => true] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => false] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' } };
			const choices = [ choice1, choice2, choice3];
			const character = CharacterData[0].key;
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, character });
			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({ choices: [ choice1.beat, choice3.beat ] });
		});
	});
	describe(`beat has two choices with conditions, character is set, and no condition is met`, () => {
		it(`returns last choice beat as a simple beat display`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => false] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => false] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' } };
			const defaultBehavior = { text:'4', nextBeat: 'D' };
			const choices = [ choice1, choice2, choice3];
			const character = CharacterData[0].key;
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, character, defaultBehavior });
			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual(choice3.beat);
		});
	});
	describe(`beat has all choices with conditions, character is set, and no condition is met`, () => {
		it(`returns default behavior as a simple beat display`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => false] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => false] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' }, conditions: [() => false] };
			const character = CharacterData[0].key;
			const defaultBehavior = { text:'4', nextBeat: 'D', character };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, character, defaultBehavior });
			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text: `${CharacterData[0].name}: ${defaultBehavior.text}`,
				nextBeat: defaultBehavior.nextBeat,
			});
		});
	});
	describe(`beat one choice with two conditions, character is set, and all conditions are met`, () => {
		it(`returns default behavior as a simple beat display`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => true, () => true] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' } };
			const choices = [ choice1, choice2];
			const character = CharacterData[0].key;
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, character });
			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({ choices: [choice1.beat, choice2.beat] });
		});
	});
	describe(`beat one choice with two conditions, character is set, and one conditions is unmet`, () => {
		it(`returns default behavior as a simple beat display`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => true, () => false] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' } };
			const choices = [ choice1, choice2];
			const character = CharacterData[0].key;
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, character });
			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual(choice2.beat);
		});
	});
});

