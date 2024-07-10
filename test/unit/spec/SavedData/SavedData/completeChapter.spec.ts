import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.startNewChapter`, () => {
	it(`updates the current and prior chapters and scenes`, () => {
		const priorChapterKey = 'firstChapter';
		const priorSceneKey = 'firstScene';
		const currentChapterKey = 'current chapter';
		const currentSceneKey = 'current scene';
		const achievementKeys = ['achieve 1', 'achieve 2'];
		const completedChapterKeys = [ priorChapterKey ];
		const savedData = new SavedData({
			priorChapterKey,
			priorSceneKey,
			currentChapterKey,
			currentSceneKey,
			achievementKeys,
			completedChapterKeys,
		});

		savedData.completeChapter();
		expect(savedData.toDto()).toEqual(expect.objectContaining({
			priorChapterKey: currentChapterKey,
			priorSceneKey: currentSceneKey,
			currentChapterKey: '',
			currentSceneKey: '',
			completedChapterKeys: [ priorChapterKey, currentChapterKey ],
		}));
	});
});
