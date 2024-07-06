interface ChapterParams {
	scenes: string[];
	locked: boolean;
	firstSceneKey: string;
	name: string;
	key: string;
}
export class Chapter {
	#key: string;
	#name: string;
	#scenes: string[];
	#locked: boolean;
	#firstSceneKey: string;
	#currentSceneKey: string;

	constructor (params: ChapterParams) {
		const { key, name, scenes, locked, firstSceneKey } = params;
		this.#key = key;
		this.#name = name;
		this.#scenes = scenes;
		this.#locked = locked;
		this.#firstSceneKey = firstSceneKey;
		this.#currentSceneKey = firstSceneKey;
	}

	// restart() { return this.#firstScene}
	start () {
		return this.#currentSceneKey;
	}
	// load()
}