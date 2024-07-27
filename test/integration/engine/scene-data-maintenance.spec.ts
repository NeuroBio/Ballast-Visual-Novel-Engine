import { NARRATOR } from '../../../src/Beat/Beat';
import { BeatDto, SingleConditionType } from '../../../src/Beat/BeatFactory';
import { ChapterDto } from '../../../src/Chapter/ChapterFinder';
import { CharacterTemplate } from '../../../src/Character/CharacterTemplateFinder';
import { Engine } from '../../../src/Engine/Engine';
import { SavedDataDto } from '../../../src/SavedData/SaveDataRepo';
import { SceneDto } from '../../../src/Scene/SceneFinder';

describe(`playing scene with scene and beat data that must be reset`, () => {
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
		{
			name: 'thirdiano',
			key: '3',
			traits: {
			},
		},
	];
	const beatData: BeatDto[] = [
		{
			key: 'A',
			defaultBehavior: {
				text: '1st to play',
				nextBeat: 'B',
				sceneData: {
					addCharacters: [
						{ character: characterData[0].key, position: 1, sprite: '1' },
						{ character: characterData[1].key, position: 1, sprite: '1' },
					],
				},
			},
		},
		{
			key: 'B',
			choices: [
				{
					text: '2nd to play for first play-through',
					nextBeat: 'C1',
				},
				{
					text: '2nd to play for second play-through',
					nextBeat: 'C2',
				},
			],
		},
		{
			key: 'C1',
			defaultBehavior: {
				text: '3rd to play for first play-through',
				nextBeat: 'D',
				sceneData: {
					addCharacters: [
						{ character: characterData[2].key, position: 2, sprite: '1' },
					],
				},
			},
		},
		{
			key: 'C2',
			defaultBehavior: {
				text: '3rd to play for first play-through',
				nextBeat: 'D',
			},
		},
		{
			key: 'D',
			branches: [
				{
					text: 'nope',
					nextBeat: 'E',
					conditions: [{
						type: SingleConditionType.CHARACTER_ABSENT,
						character: characterData[2].key,
					}],
				},
				{
					text: '4th to play',
					nextBeat: 'E',
					conditions: [{
						type: SingleConditionType.CHARACTER_PRESENT,
						character: characterData[0].key,
					}],
				},
			],
			defaultBehavior: {
				text: 'no play',
				nextBeat: 'nope',
			},
		},
		{
			key: 'E',
			responses: [
				{
					text: '5th to play',
				},
				{
					text: '6th to play',
				},
			],
			defaultBehavior: {
				text: 'should not play if restart worked',
				nextBeat: 'restarting...',
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
	it('starts scene and returns display data from default behavior on simple beat', async () => {
		const beat = await engine.startChapter({ chapterKey: chapterData[0].key });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[0].defaultBehavior!.nextBeat,
			text: beatData[0].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.objectContaining(beatData[0].defaultBehavior!.sceneData),
		});
	});
	it(`plays the next choice beat`, () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			choices: beatData[1].choices?.map((x) => ({
				text: x.text,
				nextBeat: x.nextBeat,
				mayPlay: true,
			})),
			saveData: expect.any(Object),
		});
	});
	it(`in this play-through, the user selects choice 1 that adds a character and gets the correct followup beat`, () => {
		const beat = engine.advanceScene({ beatKey: result.get().choices[0].nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[2].defaultBehavior!.nextBeat,
			text: beatData[2].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.objectContaining(beatData[2].defaultBehavior!.sceneData),
		});
	});
	it(`plays the next branch beat and fails branch 1's character absent condition and meets branch 2's character present condition`, () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[4].branches![1].nextBeat,
			text: beatData[4].branches![1].text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`plays the first response in the response beat`, () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[5].key,
			text: beatData[5].responses![0].text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`plays the second response in the response beat`, () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[5].defaultBehavior!.nextBeat,
			text: beatData[5].responses![1].text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`restarts the scene and it replays the first beat`, () => {
		const beat = engine.restartScene();
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[0].defaultBehavior!.nextBeat,
			text: beatData[0].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.objectContaining(beatData[0].defaultBehavior!.sceneData),
		});
	});
	it(`plays the next choice beat`, () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			choices: beatData[1].choices?.map((x) => ({
				text: x.text,
				nextBeat: x.nextBeat,
				mayPlay: true,
			})),
			saveData: expect.any(Object),
		});
	});
	it(`in this play-through, the user selects choice 2 that does not add a character and gets the correct followup beat`, () => {
		const beat = engine.advanceScene({ beatKey: result.get().choices[1].nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[3].defaultBehavior!.nextBeat,
			text: beatData[3].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.objectContaining({ addCharacters: [] }),
		});
	});
	it(`plays the next branch beat and meets branch 1's character absent condition`, () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[4].branches![0].nextBeat,
			text: beatData[4].branches![0].text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`response beat was properly reset and plays the first response`, () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[5].key,
			text: beatData[5].responses![0].text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
});
