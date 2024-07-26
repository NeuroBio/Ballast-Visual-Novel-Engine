import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../FakeData/TestData';

describe(`ChoiceBeat.play`, () => {
	const keyedCharacters = CharacterData.reduce((keyed: { [key: string]: Character}, char) => {
		keyed[char.key] = new Character({ ...char, memories: [] });
		return keyed;
	}, {});
	const saveData = Object.freeze({
		queuedScenes: [],
		unlockedChapters: [],
		unlockedAchievements: [],
		addedItems: [],
		removedItems: [],
		addedMemories: [],
		removedMemories: [],
		updatedCharacterTraits: [],
	});
	const sceneData = Object.freeze({
		setBackground: '',
		updateCharacterSprites: [],
		moveCharacters: [],
		removeCharacters: [],
		addCharacters: [],
	});
	describe(`beat has three choices without conditions`, () => {
		it(`returns all three choice beats ready to play`, () => {
			const choice1 = { beat: { text: '1', nextBeat: 'A', mayPlay: false }, conditions: [] };
			const choice2 = { beat: { text: '2', nextBeat: 'B', mayPlay: false }, conditions: [] };
			const choice3 = { beat: { text: '3', nextBeat: 'C', mayPlay: false }, conditions: [] };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, saveData });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				choices: choices.map(x => {
					x.beat.mayPlay = true;
					return x.beat;
				}),
				saveData: expect.any(Object),
			});
		});
	});
	describe(`beat has two choices with a condition and all conditions met`, () => {
		it(`returns all three choice beats ready to play`, () => {
			const choice1 = { beat: { text: '1', nextBeat: 'A', mayPlay: false }, conditions: [() => true] };
			const choice2 = { beat: { text: '2', nextBeat: 'B', mayPlay: false }, conditions: [() => true] };
			const choice3 = { beat: { text: '3', nextBeat: 'C', mayPlay: false }, conditions: [] };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, saveData });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				choices: choices.map(x => {
					x.beat.mayPlay = true;
					return x.beat;
				}),
				saveData: expect.any(Object),
			});
		});
	});
	describe(`beat has two choices with a condition and second condition not met`, () => {
		it(`returns first and last choice beats ready to play, second is not ready to play`, () => {
			const choice1 = { beat: { text: '1', nextBeat: 'A', mayPlay: false }, conditions: [() => true] };
			const choice2 = { beat: { text: '2', nextBeat: 'B', mayPlay: false }, conditions: [() => false] };
			const choice3 = { beat: { text: '3', nextBeat: 'C', mayPlay: false }, conditions: [] };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, saveData });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				choices: choices.map(x => {
					if (x.beat.text !== '2') {
						x.beat.mayPlay = true;
					}
					return x.beat;
				}),
				saveData: expect.any(Object),
			});
		});
	});
	describe(`beat has two choices with conditions and no condition is met`, () => {
		it(`returns last choice beat as ready to play and others as not ready`, () => {
			const choice1 = { beat: { text: '1', nextBeat: 'A', mayPlay: false }, conditions: [() => false] };
			const choice2 = { beat: { text: '2', nextBeat: 'B', mayPlay: false }, conditions: [() => false] };
			const choice3 = { beat: { text: '3', nextBeat: 'C', mayPlay: false }, conditions: [] };
			const defaultBehavior = { text: '4', nextBeat: 'D', sceneData };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, defaultBehavior, saveData });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				choices: choices.map(x => {
					if (x.beat.text === '3') {
						x.beat.mayPlay = true;
					}
					return x.beat;
				}),
				saveData: expect.any(Object),
			});
		});
	});
	describe(`beat has all choices with conditions and no condition is met`, () => {
		it(`returns default behavior as a simple beat display`, () => {
			const choice1 = { beat: { text: '1', nextBeat: 'A', mayPlay: false }, conditions: [() => false] };
			const choice2 = { beat: { text: '2', nextBeat: 'B', mayPlay: false }, conditions: [() => false] };
			const choice3 = { beat: { text: '3', nextBeat: 'C', mayPlay: false }, conditions: [() => false] };
			const character = CharacterData[0].key;
			const defaultBehavior = { text: '4', nextBeat: 'D', character, sceneData };
			const choices = [ choice1, choice2, choice3];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, defaultBehavior, saveData });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				choices: choices.map(x => x.beat),
				default: {
					text: defaultBehavior.text,
					nextBeat: defaultBehavior.nextBeat,
					speaker: CharacterData[0].name,
					saveData: expect.any(Object),
					sceneData: expect.any(Object),
				},
				saveData: expect.any(Object),
			});
		});
	});
	describe(`beat one choice with two conditions and all conditions are met`, () => {
		it(`returns default behavior as a simple beat display`, () => {
			const choice1 = { beat: { text: '1', nextBeat: 'A', mayPlay: false }, conditions: [() => true, () => true] };
			const choice2 = { beat: { text: '2', nextBeat: 'B', mayPlay: false }, conditions: [] };
			const choices = [ choice1, choice2];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, saveData });
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
		it(`returns the first choice as unplayable and the second as playable`, () => {
			const choice1 = { beat: { text: '1', nextBeat: 'A', mayPlay: false }, conditions: [() => true, () => false] };
			const choice2 = { beat: { text: '2', nextBeat: 'B', mayPlay: false }, conditions: [] };
			const choices = [ choice1, choice2];
			const key = 'key';

			const beat = new ChoiceBeat({ key, choices, saveData });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				choices: choices.map(x => {
					if (x.beat.text === '2') {
						x.beat.mayPlay = true;
					}
					return x.beat;
				}),
				saveData: expect.any(Object),
			});
		});
	});
});
