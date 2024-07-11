import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.queueScene`, () => {
	it(`updates the selected chapter's queued scene`, () => {
		const chapterKey = 'chapter';
		const sceneKey = 'scene';
		const nextSceneKey = 'nextScene';
		const savedData = new SavedData({
			activeChapters: { [chapterKey]: sceneKey },
			unlockedChapters: [],
			completedChapters: [],
			inventory: {},
			achievements: [],
		});

		savedData.queueScene(chapterKey, nextSceneKey);
		expect(savedData.toDto()).toEqual(expect.objectContaining({
			activeChapters: { [chapterKey]: nextSceneKey },
		}));
	});
});
