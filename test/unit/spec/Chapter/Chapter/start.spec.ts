import { Chapter } from '../../../../../src/Chapter/Chapter';

describe(`Chapter.start`, () => {
	describe(`fresh chapter load`, () => {
		it(`returns the key for the current scene`, () => {
			const firstSceneKey = 'firstScene';
			const chapter = new Chapter({
				name: 'chapter name',
				key: 'chapterKey',
				sceneKeys: [firstSceneKey, 'anotherScene'],
				locked: false,
				firstSceneKey,
			});

			expect(chapter.start()).toBe(firstSceneKey);
		});
	});
});
