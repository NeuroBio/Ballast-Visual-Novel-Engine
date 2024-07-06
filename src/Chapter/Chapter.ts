interface ChapterParams {
	scenes: string[];
	locked: boolean;
	firstScene: string;
	name: string;
	key: string;
}
export class Chapter {
	#key: string;
	#name: string;
	#scenes: string[];
	#locked: boolean;
	#currentScene: string;

	constructor (params: ChapterParams) {
		const { key, name, scenes, locked, firstScene } = params;
		this.#key = key;
		this.#name = name;
		this.#scenes = scenes;
		this.#locked = locked;
		this.#currentScene = firstScene;
	}
}