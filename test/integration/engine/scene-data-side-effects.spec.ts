import { NARRATOR } from '../../../src/Beat/Beat';
import { BeatDto, CrossConditionType, SingleConditionType } from '../../../src/Beat/BeatFactory';
import { ChapterDto } from '../../../src/Chapter/ChapterFinder';
import { CharacterTemplate } from '../../../src/Character/CharacterTemplateFinder';
import { Engine } from '../../../src/Engine/Engine';
import { SavedDataDto } from '../../../src/SavedData/SaveDataRepo';
import { SceneDto } from '../../../src/Scene/SceneFinder';

describe(`playing beats with scene data side effects`, () => {
	const PassConditional = Object.freeze({
		type: SingleConditionType.AT_LEAST_CHAR_TRAIT,
		character: '2',
		trait: 'sparrow',
		value: 0.1,
	});
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
	const displayData = Object.freeze({
		setBackground: 'background',
		updateCharacterSprites: [{ character: 'char', sprite: 'sigh' }],
		moveCharacters: [{ character: 'char-char', newPosition: 0 }],
		removeCharacters: [{ character: 'chi-cha' }],
		addCharacters: [{ character: 'c-c-c', position: 1, sprite: 'soup' }],
	});
	const beatData: BeatDto[] = [
		{
			key: 'A',
			defaultBehavior: {
				text: '1st to play',
				nextBeat: 'B',
				sceneData: displayData,
			},
		},
		{
			key: 'B',
			choices: [
				{
					text: 'choice no play 1',
					nextBeat: 'nope',
					conditions: [FailConditional],
				},
				{
					text: 'choice no play 2',
					nextBeat: 'nope',
					conditions: [FailConditional],
				},
			],
			defaultBehavior: {
				text: '2nd to play',
				nextBeat: 'C',
				sceneData: displayData,
			},
		},
		{
			key: 'C',
			branches: [
				{
					text: 'ff branch 1',
					nextBeat: 'nope',
					conditions: [FailConditional],
				},
				{
					text: '3rd to play',
					nextBeat: 'D',
					conditions: [PassConditional],
					sceneData: displayData,
				},
			],
			defaultBehavior: {
				text: 'ff default',
				nextBeat: 'nope',
			},
		},
		{
			key: 'D',
			branches: [
				{
					text: 'ff branch 1',
					nextBeat: 'nope',
					conditions: [FailConditional],
				},
				{
					text: 'ff branch 2',
					nextBeat: 'nope',
					conditions: [FailConditional],
				},
			],
			defaultBehavior: {
				text: '4th to play',
				nextBeat: 'E',
				sceneData: displayData,
			},
		},
		{
			key: 'E',
			branches: [
				{
					text: 'bf branch 1',
					character: '1',
					nextBeat: 'nope',
				},
				{
					text: '5th to play',
					character: '2',
					nextBeat: 'F',
					sceneData: displayData,
				},
			],
			crossBranchCondition: {
				type: CrossConditionType.GREATEST_SENTIMENT,
				trait: 'sparrow',
			},
			defaultBehavior: {
				text: 'bf default',
				nextBeat: 'nope',
			},
		},
		{
			branches: [
				{
					text: 'bf branch 1',
					character: '1',
					nextBeat: 'nope',
					conditions: [FailConditional],
				},
				{
					text: 'bf branch 2',
					character: '2',
					nextBeat: 'nope',
					conditions: [FailConditional],
				},
			],
			crossBranchCondition: {
				type: CrossConditionType.GREATEST_SENTIMENT,
				trait: 'sparrow',
			},
			key: 'F',
			defaultBehavior: {
				text: '6th to play',
				nextBeat: 'G',
				sceneData: displayData,
			},
		},
		{
			key: 'G',
			responses: [
				{
					text: '7th to play',
					sceneData: displayData,
				},
				{
					text: '8th to play',
					sceneData: displayData,
				},
			],
			defaultBehavior: {
				text: '9th to play',
				nextBeat: 'H',
				sceneData: displayData,
			},
		},
		{
			key: 'H',
			defaultBehavior: {
				text: '10th to play',
				sceneData: displayData,
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

	it('returns display data from default behavior on simple beat', async () => {
		const beat = await engine.startChapter({ chapterKey: chapterData[0].key });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[0].defaultBehavior!.nextBeat,
			text: beatData[0].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: displayData,
		});
	});
	it('returns display data from default behavior on choice beat when no choices may play', () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			choices: beatData[1].choices?.map((x) => ({
				text: x.text,
				nextBeat: x.nextBeat,
				mayPlay: false,
			})),
			default: {
				nextBeat: beatData[1].defaultBehavior!.nextBeat,
				text: beatData[1].defaultBehavior!.text,
				speaker: NARRATOR,
				sceneData: displayData,
				saveData: expect.any(Object),
			},
			saveData: expect.any(Object),
		});
	});
	it('returns display data from satisfied branch 2 on first fit branch beat', () => {
		const beat = engine.advanceScene({ beatKey: result.get().default.nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[2].branches![1].nextBeat,
			text: beatData[2].branches![1].text,
			speaker: NARRATOR,
			sceneData: displayData,
			saveData: expect.any(Object),
		});
	});
	it('returns display data from default behavior on first fit branch beat when no branches are satisfied', () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[3].defaultBehavior!.nextBeat,
			text: beatData[3].defaultBehavior!.text,
			speaker: NARRATOR,
			sceneData: displayData,
			saveData: expect.any(Object),
		});
	});
	it('returns display data from satisfied branch 2 on best fit branch beat', () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[4].branches![1].nextBeat,
			text: beatData[4].branches![1].text,
			speaker: characterData[1].name,
			sceneData: displayData,
			saveData: expect.any(Object),
		});
	});
	it('returns display data from default behavior on best fit branch beat when no branches are satisfied', () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[5].defaultBehavior!.nextBeat,
			text: beatData[5].defaultBehavior!.text,
			speaker: NARRATOR,
			sceneData: displayData,
			saveData: expect.any(Object),
		});
	});
	it('returns display data from response 1', () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[6].key,
			text: beatData[6].responses![0].text,
			speaker: NARRATOR,
			sceneData: displayData,
			saveData: expect.any(Object),
		});
	});
	it('returns display data from response 2', () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[6].defaultBehavior!.nextBeat,
			text: beatData[6].responses![1].text,
			speaker: NARRATOR,
			sceneData: displayData,
			saveData: expect.any(Object),
		});
	});
	it('returns display data from default behavior on best fit branch beat when no responses remain', () => {
		const beat = engine.advanceScene({ beatKey: beatData[6].key });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[6].defaultBehavior!.nextBeat,
			text: beatData[6].defaultBehavior!.text,
			speaker: NARRATOR,
			sceneData: displayData,
			saveData: expect.any(Object),
		});
	});
	it('returns display data from default behavior on final beat', () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			text: beatData[7].defaultBehavior!.text,
			speaker: NARRATOR,
			sceneData: displayData,
			saveData: expect.any(Object),
		});
	});
});
