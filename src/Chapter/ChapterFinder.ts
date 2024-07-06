import { ChapterData } from '../../test/unit/FakeData/TestData';
import { Chapter } from './Chapter';


export class ChapterFinder {
	byKey (chapterKey: string): Chapter {
		const data = ChapterData.find((x) => (x.key === chapterKey));
		return new Chapter(data!);
	}
}
