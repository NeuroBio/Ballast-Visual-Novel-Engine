import { Scene } from '../Scene/Scene';
import { Chapter } from './Chapter';


export class ChapterFinder {
	#chapterCache: { [chapterKey: string]: Chapter} = {};

	byKey (chapterKey: string) {
		if (!this.#chapterCache[chapterKey]) {
			// this.#chapterCache[chapterKey] = ;
		}

		return this.#chapterCache[chapterKey];
	}
}