import { Chapter } from '../../../../../src/Chapter/Chapter';
import { ChapterFinder } from '../../../../../src/Chapter/ChapterFinder';
import { ChapterData } from '../../../FakeData/TestData';

describe(`ChapterFinder.byKey`, () => {
	const Error = Object.freeze({
		NOT_FOUND: 'Requested chapter was not found.',
		LOCKED: 'This chapter has not yet been unlocked.',
	});

	describe(`loading valid chapter`, () => {
		it(`loads chapter from data`, () => {
			const chapterKey = 'firstChapter';
			const chapterFinder = new ChapterFinder({
				dataFetcher: () => ChapterData,
			});
			const chapter = chapterFinder.byKey(chapterKey);
			expect(chapter instanceof Chapter).toBe(true);
		});
	});
	describe(`chapter is not found`, () => {
		it(`throws and error`, () => {
			const chapterKey = 'lockedChapter';
			const chapterFinder = new ChapterFinder({
				dataFetcher: () => ([]),
			});
			expect(() => {
				chapterFinder.byKey(chapterKey);
			}).toThrow(Error.NOT_FOUND);
		});
	});
	describe(`chapter is locked`, () => {
		it(`throws and error`, () => {
			const chapterKey = 'lockedChapter';
			const chapterFinder = new ChapterFinder({
				dataFetcher: () => ([{
					key: chapterKey,
					name: 'Chapter Name',
					locked: true,
					firstSceneKey: 'sceneKey',
					scenes: ['sceneKey'],
				}]),
			});
			expect(() => {
				chapterFinder.byKey(chapterKey);
			}).toThrow(Error.LOCKED);
		});
	});
});
