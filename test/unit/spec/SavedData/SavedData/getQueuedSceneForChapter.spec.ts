import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.getQueuedSceneForChapter`, () => {
	it(`returns the queued scene for the specified chapter`, () => {
		const chapterKey = 'chapter';
		const sceneKey = 'scene';
		const savedData = new SavedData({
			activeChapters: { [chapterKey]: sceneKey },
			unlockedChapters: [],
			completedChapters: [],
			inventory: {},
			achievements: [],
		});

		expect(savedData.getQueuedSceneForChapter(chapterKey)).toBe(sceneKey);
	});
});
