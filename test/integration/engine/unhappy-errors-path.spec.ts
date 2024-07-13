import { Engine } from '../../../src/Engine/Engine';
import { ChapterData, SceneData } from '../../unit/FakeData/TestData';

describe(`taking actions to generate errors`, () => {
	const Error = Object.freeze({
		NO_REPLAY: 'This chapter has already been completed and does not allow replays',
		NO_ADVANCE: 'You cannot call advance scene prior to starting a chapter.',
		NO_COMPLETE: 'You cannot call complete scene prior to starting a chapter.',
		NO_SAVE: 'You cannot save data prior to loading save data.',
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
	it(`will not allow user to advance a scene before loading a chapter`, () => {
		try {
			engine.advanceScene({ beatKey: '' });
		} catch (error) {
			result.set(error);
		}

		expect(result.get().message).toEqual(Error.NO_ADVANCE);
	});
	it(`will not allow user to complete a scene before loading a chapter`, async () => {
		try {
			await engine.completeScene();
		} catch (error) {
			result.set(error);
		}

		expect(result.get().message).toEqual(Error.NO_COMPLETE);
	});
	it(`will not allow user to save a scene before loading/creating save data`, async () => {
		try {
			await engine.save();
		} catch (error) {
			result.set(error);
		}

		expect(result.get().message).toEqual(Error.NO_SAVE);
	});
	it(`refuses to load a completed chapter`, async () => {
		try {
			await engine.startChapter({ chapterKey: 'firstChapter' });
		} catch (error) {
			result.set(error);
		}

		expect(result.get().message).toEqual(Error.NO_REPLAY);
	});
});
