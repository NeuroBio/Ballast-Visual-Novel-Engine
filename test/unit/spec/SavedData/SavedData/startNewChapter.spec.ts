import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.startNewChapter`, () => {
	it(`updates save data with new chapter`, () => {
		const chapterKey = 'chapter';
		const sceneKey = 'scene';
		const savedData = new SavedData({
			activeChapters: {},
			unlockedChapters: [],
			completedChapters: [],
			inventory: {},
			achievements: [],
			characters: [],
		});

		savedData.startNewChapter(chapterKey, sceneKey);
		expect(savedData.toDto()).toEqual(expect.objectContaining({
			activeChapters: { [chapterKey]: sceneKey },
		}));
	});
});
