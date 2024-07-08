import { Chapter } from '../../../../../src/Chapter/Chapter';

describe(`Chapter.restart`, () => {
	describe(`chapter is on a scene other than the first`, () => {
		it(`returns the key for the first scene`, () => {
			const firstSceneKey = 'firstScene';
			const chapter = new Chapter({
				name: 'chapter name',
				key: 'chapterKey',
				sceneKeys: [firstSceneKey, 'anotherScene'],
				locked: false,
				firstSceneKey,
			});

			expect(chapter.restart()).toBe(firstSceneKey);
		});
	});
});
