import { Chapter } from '../../../../../src/Chapter/Chapter';

describe(`Chapter.isLocked`, () => {
	describe(`chapter is locked`, () => {
		it(`returns true`, () => {
			const firstSceneKey = 'firstScene';
			const chapter = new Chapter({
				name: 'chapter name',
				key: 'chapterKey',
				sceneKeys: [firstSceneKey, 'anotherScene'],
				locked: true,
				firstSceneKey,
			});

			expect(chapter.isLocked()).toBe(true);
		});
	});
	describe(`chapter is unlocked`, () => {
		it(`returns false`, () => {
			const firstSceneKey = 'firstScene';
			const chapter = new Chapter({
				name: 'chapter name',
				key: 'chapterKey',
				sceneKeys: [firstSceneKey, 'anotherScene'],
				locked: false,
				firstSceneKey,
			});

			expect(chapter.isLocked()).toBe(false);
		});
	});
});
