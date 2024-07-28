import { NARRATOR } from '../../../src/Beat/Beat';
import { BeatDto } from '../../../src/Beat/BeatFactory';
import { ChapterDto } from '../../../src/Chapter/ChapterFinder';
import { CharacterTemplate } from '../../../src/Character/CharacterTemplateFinder';
import { Engine } from '../../../src/Engine/Engine';
import { SavedDataDto } from '../../../src/SavedData/SaveDataRepo';
import { SceneDto } from '../../../src/Scene/SceneFinder';

describe(`completing one chapter and then starting a new one right after with the same engine`, () => {
	const characterData: CharacterTemplate[] = [];
	const beatData: BeatDto[] = [
		{
			key: 'A',
			defaultBehavior: {
				text: '1st to play',
				nextBeat: 'B',
			},
		},
		{
			key: 'B',
			defaultBehavior: {
				text: 'last to play',
			},
		},
	];
	const sceneData: SceneDto[] = [
		{
			key: 'leScene',
			name: 'something occurred!',
			firstBeatKey: beatData[0].key,
			beats: beatData,
		},
		{
			key: 'leScene2',
			name: 'something new occurred!',
			firstBeatKey: beatData[0].key,
			beats: beatData,
		},
	];
	const chapterKey = 'leChap';
	const chapterData: ChapterDto[] = [{
		name: 'leSeriesOfScenes',
		key: chapterKey,
		locked: false,
		allowReplay: true,
		firstSceneKey: sceneData[0].key,
		sceneKeys: sceneData.map((x) => x.key),
	}];
	const savedData: SavedDataDto = {
		activeChapters: { },
		unlockedChapters: [ ],
		completedChapters: [ ],
		inventory: {},
		achievements: [],
		characters: [],
	};
	const engine = new Engine({
		findChapterData: () => Promise.resolve(chapterData),
		findSceneData: () => Promise.resolve(sceneData),
		findCharacterData: () => Promise.resolve(characterData),
		findSavedData: () => Promise.resolve(savedData),
		saveSavedData: () => Promise.resolve(),
	});
	let priorResult: any;
	const result = {
		get: () => priorResult,
		set (newResult: any) {
			console.debug(newResult.message || newResult.choices || newResult);
			priorResult = newResult;
		},
	};
	it(`plays the first beat`, async () => {
		const start = await engine.startChapter({ chapterKey });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[0].defaultBehavior!.nextBeat,
			text: beatData[0].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`plays the final beat`, () => {
		const beat = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(beat);
		expect(result.get()).toEqual({
			nextBeat: beatData[1].defaultBehavior!.nextBeat,
			text: beatData[1].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`complete the scene`, async () => {
		await engine.completeScene();
	});
	it(`starts a chapter again`, async () => {
		const start = await engine.startChapter({ chapterKey });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[0].defaultBehavior!.nextBeat,
			text: beatData[0].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
});