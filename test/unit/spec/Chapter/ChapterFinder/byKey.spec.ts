import { Chapter } from '../../../../../src/Chapter/Chapter';
import { ChapterFinder } from '../../../../../src/Chapter/ChapterFinder';

describe(`ChapterFinder.byKey`, () => {
	const KEY = 'firstChapter';

	it(`loads chapter from data`, () => {
		const chapterFinder = new ChapterFinder();
		const chapter = chapterFinder.byKey(KEY);
		expect(chapter instanceof Chapter).toBe(true);
	});
});
