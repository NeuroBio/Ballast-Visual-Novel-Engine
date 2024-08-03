import { Chapter } from '../../../../../src/Chapter/Chapter';

describe('Chapter getters', () => {
	const chapterParams = {
		name: 'chapter name',
		key: 'chapterKey',
		sceneKeys: ['first key', 'anotherScene'],
		locked: false,
		firstSceneKey: 'first key',
	};
	const chapter = new Chapter(chapterParams);
	describe(`key`, () => {
		it(`returns the expected data`, () => {
			expect(chapter.key).toBe(chapterParams.key);
		});
	});
	describe(`isLocked when unlocked`, () => {
		it(`returns the expected data`, () => {
			expect(chapter.isLocked).toBe(chapterParams.locked);
		});
	});
	describe(`isLocked when locked is unset`, () => {
		it(`returns the expected data`, () => {
			const chapterParams = {
				name: 'chapter name',
				key: 'chapterKey',
				sceneKeys: ['first key', 'anotherScene'],
				firstSceneKey: 'first key',
			};
			const chapter = new Chapter(chapterParams);
			expect(chapter.isLocked).toBe(true);
		});
	});
});