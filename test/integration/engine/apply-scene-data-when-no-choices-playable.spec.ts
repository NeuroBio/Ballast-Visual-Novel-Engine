import { NARRATOR } from '../../../src/Beat/Beat';
import { BeatDto, SingleConditionType } from '../../../src/Beat/BeatFactory';
import { ChapterDto } from '../../../src/Chapter/ChapterFinder';
import { CharacterTemplate } from '../../../src/Character/CharacterTemplateFinder';
import { Engine } from '../../../src/Engine/Engine';
import { SavedDataDto } from '../../../src/SavedData/SaveDataRepo';
import { SceneDto } from '../../../src/Scene/SceneFinder';

describe(`playing scene with scene and beat data that must be reset`, () => {
	const FailConditional = Object.freeze({
		type: SingleConditionType.AT_LEAST_ITEM,
		item: 'noHave',
		quantity: 1,
	});
	const characterData: CharacterTemplate[] = [
		{
			name: 'firsto',
			key: '1',
			traits: {},
		},
		{
			name: 'seconda',
			key: '2',
			traits: {
				sparrow: 0.5,
				falcon: 0.3,
			},
		},
	];
	const beatData: BeatDto[] = [
		{
			key: 'A',
			choices: [
				{
					text: 'choice 1',
					nextBeat: 'nope',
					conditions: [FailConditional],
				},
				{
					text: 'choice 2',
					nextBeat: 'nope',
					conditions: [FailConditional],
				},
			],
			defaultBehavior: {
				text: '1st to play',
				nextBeat: 'B',
				sceneData: {
					addCharacters: [ { character: characterData[0].key, position: 0, sprite: '1' }],
				},
			},
		},
		{
			key: 'B',
			branches: [
				{
					text: 'plays 2nd',
					nextBeat: 'done',
					conditions: [{
						type: SingleConditionType.CHARACTER_PRESENT,
						character: characterData[0].key,
					}],
				},
				{
					text: 'nope',
					nextBeat: 'nope',
					conditions: [{
						type: SingleConditionType.CHARACTER_ABSENT,
						character: characterData[0].key,
					}],
				},
			],
			defaultBehavior: {
				text: 'nope',
				nextBeat: 'nope',
			},
		},
	];
	const sceneData: SceneDto[] = [{
		key: 'leScene',
		name: 'something occurred!',
		firstBeatKey: beatData[0].key,
		beats: beatData,
	}];
	const chapterData: ChapterDto[] = [{
		name: 'leSeriesOfScenes',
		key: 'leChap',
		locked: false,
		firstSceneKey: sceneData[0].key,
		sceneKeys: [sceneData[0].key],
	}];
	const savedData: SavedDataDto = {
		activeChapters: { },
		unlockedChapters: [ ],
		completedChapters: [ ],
		inventory: { },
		achievements: [],
		characters: [],
	};
	const saveSavedData = jest.fn();
	const engine = new Engine({
		findChapterData: () => Promise.resolve(chapterData),
		findSceneData: () => Promise.resolve(sceneData),
		findCharacterData: () => Promise.resolve(characterData),
		findSavedData: () => Promise.resolve(savedData),
		saveSavedData,
	});
	let priorResult: any;
	const result = {
		get: () => priorResult,
		set (newResult: any) {
			console.debug(newResult.message || newResult.choices || newResult);
			priorResult = newResult;
		},
	};
	it(`starts scene and returns choice display data with a default an applies the default's display data`, async () => {
		const beat = await engine.startChapter({ chapterKey: chapterData[0].key });
		result.set(beat);
		expect(result.get()).toEqual({
			choices: beatData[0].choices!.map((x) => ({
				text: x.text,
				nextBeat: x.nextBeat,
				mayPlay: false,
			})),
			default: {
				nextBeat: beatData[0].defaultBehavior!.nextBeat,
				text: beatData[0].defaultBehavior!.text,
				speaker: NARRATOR,
				sceneData: expect.objectContaining(beatData[0].defaultBehavior!.sceneData),
				saveData: expect.any(Object),
			},
			saveData: expect.any(Object),
		});
	});
	it(`plays branch from first fit branch beat requiring behavior from choice beat's default behavior`, () => {
		const beat = engine.advanceScene({ beatKey: result.get().default.nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[1].branches![0].nextBeat,
			text: beatData[1].branches![0].text,
			speaker: NARRATOR,
			sceneData: expect.any(Object),
			saveData: expect.any(Object),
		});
	});
});