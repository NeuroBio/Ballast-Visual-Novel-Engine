import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.unlockChapter`, () => {
	it(`adds the chapters to the locked chapters list`, () => {
		const savedData = new SavedData({
			activeChapters: { },
			unlockedChapters: [],
			completedChapters: [],
			inventory: {},
			achievements: [],
		});
		const unlockedChapter = 'chapter';

		savedData.unlockChapter(unlockedChapter);
		expect(savedData.toDto()).toEqual(expect.objectContaining({
			unlockedChapters: [unlockedChapter],
		}));
	});
});