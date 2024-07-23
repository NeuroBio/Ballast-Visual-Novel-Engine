import { NARRATOR } from '../../../src/Beat/Beat';
import { BeatDto } from '../../../src/Beat/BeatFactory';
import { ChapterDto } from '../../../src/Chapter/ChapterFinder';
import { CharacterDto } from '../../../src/Character/Character';
import { Engine } from '../../../src/Engine/Engine';
import { SavedDataDto } from '../../../src/SavedData/SaveDataRepo';
import { SceneDto } from '../../../src/Scene/SceneFinder';

describe(`playing beats with save data side effects`, () => {
	const characterData: CharacterDto[] = [
		{
			name: 'firsto',
			key: '1',
			memories: [],
			traits: {},
		},
		{
			name: 'seconda',
			key: '2',
			memories: [ 'mem1', 'mem2' ],
			traits: {
				sparrow: 0.5,
				falcon: 0.3,
			},
		},
	];
	const beatData: BeatDto[] = [
		{
			key: 'A',
			defaultBehavior: {
				text: '1st to play',
				nextBeat: 'B',
			},
		},
	];
	const sceneData: SceneDto[] = [{
		key: 'leScene',
		name: 'something occurred!',
		locked: false,
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
		activeChapters: { [chapterData[0].key]: sceneData[0].key },
		unlockedChapters: [ ],
		completedChapters: [ ],
		inventory: {
			removeItem1: 1,
			removeItem2: 2,
		},
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
		const start = await engine.startChapter({ chapterKey: chapterData[0].key });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[0].defaultBehavior!.nextBeat,
			text: beatData[0].defaultBehavior!.text,
			speaker: NARRATOR,
		});
	});
});
