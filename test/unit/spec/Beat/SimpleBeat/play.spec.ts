import { NARRATOR } from '../../../../../src/Beat/Beat';
import { SimpleBeat } from '../../../../../src/Beat/SimpleBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../../fake-data/TestData';

describe(`SimpleBeat.play`, () => {
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

	describe(`character is unset`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const nextBeat = 'beater';
			const key = 'key';
			const beat = new SimpleBeat({ key, defaultBehavior: { text, nextBeat, sceneData }, saveData });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text,
				nextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`character is set`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const nextBeat = 'beater';
			const characterKey = CharacterData[0].key;
			const characterName = CharacterData[0].name;
			const key = 'key';
			const beat = new SimpleBeat({ key, defaultBehavior: { text, nextBeat, character: characterKey, sceneData }, saveData });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text,
				nextBeat,
				speaker: characterName,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
});

