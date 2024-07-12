import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.getChapterData.`, () => {
	describe(`chapter was not in save data`, () => {
		it(`returns data requesting no changes be made`, () => {
			const requestedChapter = 'chapter';
			const savedData = new SavedData({
				activeChapters: {},
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
			});

			expect(savedData.getChapterData(requestedChapter)).toEqual({
				isUnlocked: false,
				wasCompleted: false,
				queuedScene: '',
			});
		});
	});
	describe(`chapter was unlocked but is not active or completed`, () => {
		it(`returns data requesting chapter unlock`, () => {
			const requestedChapter = 'chapter';
			const savedData = new SavedData({
				activeChapters: {},
				unlockedChapters: [requestedChapter],
				completedChapters: [],
				inventory: {},
				achievements: [],
			});

			expect(savedData.getChapterData(requestedChapter)).toEqual({
				isUnlocked: true,
				wasCompleted: false,
				queuedScene: '',
			});
		});
	});
	describe(`chapter was not locked but is active, not completed`, () => {
		it(`returns data requesting setting current scene`, () => {
			const requestedChapter = 'chapter';
			const queuedScene = 'scene';
			const savedData = new SavedData({
				activeChapters: { [requestedChapter]: queuedScene },
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
			});

			expect(savedData.getChapterData(requestedChapter)).toEqual({
				isUnlocked: false,
				wasCompleted: false,
				queuedScene: queuedScene,
			});
		});
	});
	describe(`chapter was not locked and was completed`, () => {
		it(`returns data requesting be marked as completed`, () => {
			const requestedChapter = 'chapter';
			const savedData = new SavedData({
				activeChapters: {},
				unlockedChapters: [],
				completedChapters: [requestedChapter],
				inventory: {},
				achievements: [],
			});

			expect(savedData.getChapterData(requestedChapter)).toEqual({
				isUnlocked: false,
				wasCompleted: true,
				queuedScene: '',
			});
		});
	});
});