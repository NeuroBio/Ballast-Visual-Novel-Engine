export class Chapter {
	#key;
	#sceneKeys;
	#locked;
	#firstSceneKey;
	#currentSceneKey;
	#allowReplay;
	constructor (params) {
		const { key, sceneKeys, locked, firstSceneKey, allowReplay } = params;
		this.#key = key;
		this.#sceneKeys = new Set(sceneKeys);
		this.#locked = locked ?? true;
		this.#firstSceneKey = firstSceneKey;
		this.#currentSceneKey = firstSceneKey;
		this.#allowReplay = allowReplay ?? false;
	}
	get key () {
		return this.#key;
	}
	get isLocked () {
		return this.#locked;
	}
	start () {
		return this.#currentSceneKey;
	}
	reload (save) {
		if (save.isUnlocked) {
			this.#locked = false;
		}
		if (this.#locked) {
			throw new Error('This chapter has not yet been unlocked.');
		}
		if (save.queuedScene) {
			if (!this.#sceneKeys.has(save.queuedScene)) {
				throw new Error('Tried to restart chapter at an invalid scene.');
			}
			this.#currentSceneKey = save.queuedScene;
		}
		if (save.wasCompleted && this.#allowReplay === false) {
			throw new Error('This chapter has already been completed and does not allow replays');
		}
	}
}
