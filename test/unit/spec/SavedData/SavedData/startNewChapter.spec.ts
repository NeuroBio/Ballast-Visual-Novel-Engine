import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.startNewChapter`, () => {
	it(`returns a save data dto`, () => {
		const priorChapterKey = 'firstChapter';
		const priorSceneKey = 'firstScene';
		const currentChapterKey = 'current chapter';
		const nextChapterKey = 'another chapter';
		const currentSceneKey = 'current scene';
		const achievementKeys = ['achieve 2', 'achieve 2'];
		const completeChapterKeys = [currentChapterKey, 'another chapter'];
		const savedData = new SavedData({
			priorChapterKey,
			priorSceneKey,
			currentChapterKey,
			currentSceneKey,
			achievementKeys,
			completeChapterKeys,
		});

		savedData.startNewChapter(nextChapterKey);
		expect(savedData.currentChapterKey).toEqual(nextChapterKey);
	});
});
