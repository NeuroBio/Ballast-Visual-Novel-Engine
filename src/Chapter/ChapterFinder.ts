import { ChapterData } from '../../test/unit/FakeData/TestData';
import { Chapter } from './Chapter';


export class ChapterFinder {
	#chapterCache: { [chapterKey: string]: Chapter} = {};

	byKey (chapterKey: string) {
		if (!this.#chapterCache[chapterKey]) {
			this.#chapterCache[chapterKey] = new Chapter(ChapterData[0]);
		}

		return this.#chapterCache[chapterKey];
	}
}