import { Chapter } from '../../../../../src/Chapter/Chapter';
import { ChapterFinder } from '../../../../../src/Chapter/ChapterFinder';
import { ChapterData } from '../../../../fake-data/TestData';

describe(`ChapterFinder.all`, () => {
	it(`loads all chapters from data`, async () => {
		const chapterFinder = new ChapterFinder({
			findData: () => Promise.resolve(ChapterData),
		});
		const chapters = await chapterFinder.all();
		expect(chapters[0] instanceof Chapter).toBe(true);
		expect(chapters[1] instanceof Chapter).toBe(true);
	});
});
