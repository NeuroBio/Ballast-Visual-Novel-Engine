import { Chapter } from '../../../../../src/Chapter/Chapter';
import { ChapterFinder } from '../../../../../src/Chapter/ChapterFinder';
import { ChapterData } from '../../../FakeData/TestData';

describe(`ChapterFinder.byKey`, () => {
	const KEY = 'firstChapter';

	it(`loads chapter from data`, () => {
		const chapterFinder = new ChapterFinder({
			dataFetcher: () => ChapterData,
		});
		const chapter = chapterFinder.byKey(KEY);
		expect(chapter instanceof Chapter).toBe(true);
	});
});
