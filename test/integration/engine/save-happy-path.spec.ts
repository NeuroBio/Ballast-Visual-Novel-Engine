import { NARRATOR } from '../../../src/Beat/Beat';
import { Engine } from '../../../src/Engine/Engine';
import { BeatData, ChapterData, SceneData } from '../../unit/FakeData/TestData';

describe(`playing through the test data without save data`, () => {
	const Error = Object.freeze({
		NO_REPLAY: 'This chapter has already been completed and does not allow replays',
	});
	const chapterKey = 'secondChapter';
	const engine = new Engine({
		findChapterData: () => Promise.resolve(ChapterData),
		findSceneData: () => Promise.resolve(SceneData),
		findSavedData: () => Promise.resolve({
			activeChapters: { [chapterKey]: 'secondSceneKey' },
			unlockedChapters: [ chapterKey ],
			completedChapters: ['firstChapter' ],
			inventory: {},
			achievements: [],
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
	it(`refuses to load the completed chapter`, async () => {
		let thrownError: any;
		try {
			await engine.startChapter({ chapterKey: 'firstChapter' });
		} catch (error) {
			thrownError = error;
		}

		console.log('Threw: ', thrownError.message);
		expect(thrownError.message).toEqual(Error.NO_REPLAY);
	});
	it(`plays the first beat`, async () => {
		const start = await engine.startChapter({ chapterKey });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: BeatData[0].nextBeat,
			text: `${NARRATOR}: ${BeatData[0].text}`,
		});
	});
});