import { NARRATOR } from '../../../src/Beat/Beat';
import { Engine } from '../../../src/Engine/Engine';
import { BeatData, ChapterData, CharacterData, SceneData } from '../../unit/FakeData/TestData';

describe(`playing through the test data without save data`, () => {
	const chapterKey = 'secondChapter';
	const engine = new Engine({
		findChapterData: () => Promise.resolve(ChapterData),
		findSceneData: () => Promise.resolve(SceneData),
		findCharacterData: () => Promise.resolve(CharacterData),
		findSavedData: () => Promise.resolve({
			activeChapters: { [chapterKey]: 'secondSceneKey' },
			unlockedChapters: [ chapterKey ],
			completedChapters: ['firstChapter' ],
			inventory: {},
			achievements: [],
			characters: [],
		}),
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
			nextBeat: BeatData[0].defaultBehavior!.nextBeat,
			text: BeatData[0].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
		});
	});
});