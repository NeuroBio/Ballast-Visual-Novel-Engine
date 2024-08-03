import { NARRATOR } from '../../../../../src/Beat/Beat';
import { FinalBeat } from '../../../../../src/Beat/FinalBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../../fake-data/TestData';

describe(`FinalBeat.play`, () => {
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
			const key = 'key';
			const beat = new FinalBeat({ key, defaultBehavior: { text, sceneData }, saveData });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`character is set`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const characterKey = CharacterData[0].key;
			const characterName = CharacterData[0].name;
			const key = 'key';
			const beat = new FinalBeat({ key, defaultBehavior: { text, character: characterKey, sceneData }, saveData });
			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text,
				speaker: characterName,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
});
