import { Chapter } from '../../../../../src/Chapter/Chapter';
import { ChapterFinder } from '../../../../../src/Chapter/ChapterFinder';
import { ChapterData } from '../../../../fake-data/TestData';

describe(`ChapterFinder.byKey`, () => {
	it(`loads chapter from data`, async () => {
		const chapterKey = 'firstChapter';
		const chapterFinder = new ChapterFinder({
			findData: () => Promise.resolve(ChapterData),
		});
		const chapter = await chapterFinder.byKey(chapterKey);
		expect(chapter instanceof Chapter).toBe(true);
	});
});
