import { Chapter } from '../../../../../src/Chapter/Chapter';
import { ChapterFinder } from '../../../../../src/Chapter/ChapterFinder';


describe(`ChapterFinder.byKey`, () => {
	describe(`Chapter not in cache`, () => {
		it(`loads chapter from data`, () => {
			const chapterFinder = new ChapterFinder();
			const chapter = chapterFinder.byKey('firstChapter');
			expect(chapter instanceof Chapter).toBe(true);
		});
	});
	describe(`Chapter in cache`, () => {
		it(`loads chapter from cache`, () => {
			const chapterFinder = new ChapterFinder();
			chapterFinder.byKey('firstChapter');
			const chapter = chapterFinder.byKey('firstChapter');
			expect(chapter instanceof Chapter).toBe(true);
		});
	});
});