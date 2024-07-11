import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.completeChapter`, () => {
	it(`updates the save data by moving chapter from active to completed`, () => {
		const priorChapterKey = 'first';
		const currentChapterKey = 'second';
		const activeChapters = { [currentChapterKey]: 'some scene' };
		const completedChapters = [ priorChapterKey ];
		const savedData = new SavedData({
			activeChapters,
			unlockedChapters: [],
			completedChapters,
			inventory: {},
			achievements: [],
		});

		savedData.completeChapter(currentChapterKey);

		expect(savedData.toDto()).toEqual(expect.objectContaining({
			completedChapters: [ priorChapterKey, currentChapterKey ],
			activeChapters: {},
		}));
	});
});
