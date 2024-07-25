import { NARRATOR } from '../../../../../src/Beat/Beat';
import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../FakeData/TestData';

describe(`ChoiceBeat.play`, () => {
	const keyedCharacters = CharacterData.reduce((keyed: { [key: string]: Character}, char) => {
		keyed[char.key] = new Character({ ...char, memories: [] });
		return keyed;
	}, {});
	describe(`beat has three choices without conditions`, () => {
		it(`returns all three choice beats`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' }, conditions: [] };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				choices: choices.map(x => x.beat),
				saveData: expect.any(Object),
			});
		});
	});
	describe(`beat has two choices with a condition and all conditions met`, () => {
		it(`returns all three choice beats`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => true] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => true] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' }, conditions: [] };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				choices: choices.map(x => x.beat),
				saveData: expect.any(Object),
			});
		});
	});
	describe(`beat has two choices with a condition and second condition not met`, () => {
		it(`returns first and last choice beats`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => true] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => false] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' }, conditions: [] };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				choices: [ choice1.beat, choice3.beat ],
				saveData: expect.any(Object),
			});
		});
	});
	describe(`beat has two choices with conditions and no condition is met`, () => {
		it(`returns last choice beat as a simple beat display`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => false] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => false] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' }, conditions: [] };
			const defaultBehavior = { text:'4', nextBeat: 'D' };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, defaultBehavior });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: choice3.beat.text,
				nextBeat: choice3.beat.nextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
			});
		});
	});
	describe(`beat has all choices with conditions and no condition is met`, () => {
		it(`returns default behavior as a simple beat display`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => false] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [() => false] };
			const choice3 = { beat: { text:'3', nextBeat: 'C' }, conditions: [() => false] };
			const character = CharacterData[0].key;
			const defaultBehavior = { text:'4', nextBeat: 'D', character };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, defaultBehavior });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: defaultBehavior.text,
				nextBeat: defaultBehavior.nextBeat,
				speaker: CharacterData[0].name,
				saveData: expect.any(Object),
			});
		});
	});
	describe(`beat one choice with two conditions and all conditions are met`, () => {
		it(`returns default behavior as a simple beat display`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => true, () => true] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [] };
			const choices = [ choice1, choice2];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				choices: [choice1.beat, choice2.beat],
				saveData: expect.any(Object),
			});
		});
	});
	describe(`beat one choice with two conditions and one conditions is unmet`, () => {
		it(`returns default behavior as a simple beat display`, () => {
			const choice1 = { beat: { text:'1', nextBeat: 'A' }, conditions: [() => true, () => false] };
			const choice2 = { beat: { text:'2', nextBeat: 'B' }, conditions: [] };
			const choices = [ choice1, choice2];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: choice2.beat.text,
				nextBeat: choice2.beat.nextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
			});
		});
	});
});

