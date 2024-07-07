import { Chapter } from '../../../../../src/Chapter/Chapter';
import { ChapterFinder } from '../../../../../src/Chapter/ChapterFinder';
import { ChapterData } from '../../../FakeData/TestData';

describe(`ChapterFinder.byKey`, () => {
	const Error = Object.freeze({
		NOT_FOUND: 'Requested chapter was not found.',
		LOCKED: 'This chapter has not yet been unlocked.',
	});

	describe(`loading valid chapter`, () => {
		it(`loads chapter from data`, async () => {
			const chapterKey = 'firstChapter';
			const chapterFinder = new ChapterFinder({
				dataFetcher: () => Promise.resolve(ChapterData),
			});
			const chapter = await chapterFinder.byKey(chapterKey);
			expect(chapter instanceof Chapter).toBe(true);
		});
	});
	describe(`chapter is not found`, () => {
		it(`throws and error`, async () => {
			const chapterKey = 'lockedChapter';
			const chapterFinder = new ChapterFinder({
				dataFetcher: () => Promise.resolve([]),
			});
			await expect(async () => {
				await chapterFinder.byKey(chapterKey);
			}).rejects.toThrow(Error.NOT_FOUND);
		});
	});
	describe(`chapter is locked`, () => {
		it(`throws and error`, async () => {
			const chapterKey = 'lockedChapter';
			const chapterFinder = new ChapterFinder({
				dataFetcher: () => Promise.resolve([{
					key: chapterKey,
					name: 'Chapter Name',
					locked: true,
					firstSceneKey: 'sceneKey',
					scenes: ['sceneKey'],
				}]),
			});
			await expect(async () => {
				await chapterFinder.byKey(chapterKey);
			}).rejects.toThrow(Error.LOCKED);
		});
	});
});
