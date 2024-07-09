import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.startNewScene`, () => {
	it(`updates the current and prior scenes`, () => {
		const priorChapterKey = 'firstChapter';
		const priorSceneKey = 'firstScene';
		const currentChapterKey = 'current chapter';
		const nextSceneKey = 'another scene';
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

		savedData.startNewScene(nextSceneKey);
		expect(savedData.toDto()).toEqual(expect.objectContaining({
			priorSceneKey: currentSceneKey,
			currentSceneKey: nextSceneKey,
		}));
	});
});
