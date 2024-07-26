import { NARRATOR } from '../../../../../src/Beat/Beat';
import { MultiResponseBeat } from '../../../../../src/Beat/MultiResponseBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../FakeData/TestData';

describe(`MultiResponseBeat.play`, () => {
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

	describe(`
		playing a beat with two non-conditional responses without characters
		and no set next beats
		for the first time
	`, () => {
		it(`returns the multi response beat's key with the first beat's text`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first', sceneData }, conditions: [] };
			const response2 = { beat: { text: 'second', sceneData }, conditions: [] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat, sceneData },
				saveData,
			});

			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: response1.beat.text,
				nextBeat: parentBeatKey,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`
		playing a beat with two non-conditional responses without characters
		and no set next beats
		for the second time
	`, () => {
		it(`returns the multi response beat's default behavior key with the second beat's text`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first', sceneData }, conditions: [] };
			const response2 = { beat: { text: 'second', sceneData }, conditions: [] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat, sceneData },
				saveData,
			});
			beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			});

			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: response2.beat.text,
				nextBeat: defaultNextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`
		playing a beat with two non-conditional responses without characters
		and set next beats
		for the first time
	`, () => {
		it(`returns data from the first response`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first', nextBeat: 'firstNext', sceneData }, conditions: [] };
			const response2 = { beat: { text: 'second', nextBeat: 'nextNext', sceneData }, conditions: [] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat, sceneData },
				saveData,
			});

			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: response1.beat.text,
				nextBeat: response1.beat.nextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`
		playing a beat with two non-conditional responses without characters
		and set next beats
		for the second time
	`, () => {
		it(`returns data from the second response`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first', nextBeat: 'firstNext', sceneData }, conditions: [] };
			const response2 = { beat: { text: 'second', nextBeat: 'nextNext', sceneData }, conditions: [] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat, sceneData },
				saveData,
			});
			beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			});

			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: response2.beat.text,
				nextBeat: response2.beat.nextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`
		playing a beat with three conditional responses without characters
		and only the second condition is met
		for the first time
	`, () => {
		it(`returns the multi response beat's key with the second beat's text`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first', sceneData }, conditions: [() => false] };
			const response2 = { beat: { text: 'second', sceneData }, conditions: [() => true] };
			const response3 = { beat: { text: 'second', sceneData }, conditions: [() => false] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2, response3],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat, sceneData },
				saveData,
			});

			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: response2.beat.text,
				nextBeat: defaultNextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`
		playing a beat with three conditional responses without characters
		and no set next beats
		and only the second condition is met
		for the second time
	`, () => {
		it(`returns the multi response beat's default behavior key with the third beat's text`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first', sceneData }, conditions: [() => false] };
			const response2 = { beat: { text: 'second', sceneData }, conditions: [() => true] };
			const response3 = { beat: { text: 'second', sceneData }, conditions: [() => false] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2, response3],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat, sceneData },
				saveData,
			});
			beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			});

			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: defaultText,
				nextBeat: defaultNextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`
		playing a beat with three conditional responses without characters
		and no set next beats
		no condition is met
		for the first time
	`, () => {
		it(`returns the multi response beat's default behavior`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first', sceneData }, conditions: [() => false] };
			const response2 = { beat: { text: 'second', sceneData }, conditions: [() => false] };
			const response3 = { beat: { text: 'second', sceneData }, conditions: [() => false] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2, response3],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat, sceneData },
				saveData,
			});
			beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			});

			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: defaultText,
				nextBeat: defaultNextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
});
