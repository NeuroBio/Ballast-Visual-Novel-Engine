import { ChapterFinder } from '../Chapter/ChapterFinder.js';
import { CharacterTemplateFinder } from '../Character/CharacterTemplateFinder.js';
import { SavedDataRepo } from '../SavedData/SaveDataRepo.js';
import { SceneFinder } from '../Scene/SceneFinder.js';
export class Engine {
	#chapterFinder;
	#sceneFinder;
	#characterTemplateFinder;
	#savedDataRepo;
	#originalSave;
	#currentSave;
	#currentChapter;
	#currentScene;
	#sceneState;
	constructor (params) {
		const { findChapterData, findSceneData, findSavedData, findCharacterData, createSavedData, saveSavedData, autosaveSaveData } = params;
		this.#chapterFinder = params.chapterFinder || new ChapterFinder({ findData: findChapterData });
		this.#sceneFinder = params.sceneFinder || new SceneFinder({ findData: findSceneData });
		this.#characterTemplateFinder = params.characterTemplateFinder || new CharacterTemplateFinder({ findData: findCharacterData });
		this.#savedDataRepo = params.savedDataRepo || new SavedDataRepo({
			findData: findSavedData,
			createData: createSavedData,
			saveData: saveSavedData,
			autosaveData: autosaveSaveData,
		});
	}
	async loadSavedData () {
		const latestSaveData = await this.#savedDataRepo.findOrCreate();
		const characterTemplates = await this.#characterTemplateFinder.all();
		latestSaveData.addMissingCharacters(characterTemplates);
		this.#refreshSave(latestSaveData);
	}
	#refreshSave (latestSaveData) {
		this.#originalSave = latestSaveData;
		this.#currentSave = this.#originalSave.clone();
	}
	async getChapters (params = {}) {
		const { excludeLocked, excludeUnlocked } = params;
		if (!this.#currentSave) {
			await this.loadSavedData();
		}
		let chapters = await this.#chapterFinder.all();
		chapters.forEach(chapter => chapter.reload(this.#currentSave.getChapterData(chapter.key)));
		if (excludeLocked) {
			chapters = chapters.filter((chap) => !chap.isLocked);
		}
		if (excludeUnlocked) {
			chapters = chapters.filter((chap) => chap.isLocked);
		}
		return chapters;
	}
	async startChapter (params) {
		const { chapterKey } = params;
		if (this.#currentScene) {
			throw new Error('Cannot start a new chapter while a scene is in progress.  Did you mean to call "restartScene?"');
		}
		if (!this.#currentSave) {
			await this.loadSavedData();
		}
		this.#currentChapter = await this.#findChapterElseThrow(chapterKey);
		this.#currentScene = await this.#findSceneElseThrow(this.#currentChapter.start());
		this.#currentSave.startNewChapter({
			chapterKey: this.#currentChapter.key,
			sceneKey: this.#currentScene.key,
		});
		this.#clearSceneState();
		return this.#playBeatOrThrow(this.#currentScene.start());
	}
	async #findChapterElseThrow (chapterKey) {
		const chapter = await this.#chapterFinder.byKey(chapterKey);
		if (!chapter) {
			throw new Error('Requested chapter was not found.');
		}
		chapter.reload(this.#currentSave.getChapterData(chapter.key));
		return chapter;
	}
	async #findSceneElseThrow (sceneKey) {
		const scene = await this.#sceneFinder.byKey(sceneKey);
		if (!scene) {
			throw new Error('Requested scene was not found.');
		}
		return scene;
	}
	advanceScene (params) {
		if (!this.#currentScene) {
			throw new Error('You cannot call advance scene prior to starting a chapter.');
		}
		const { beatKey } = params;
		return this.#playBeatOrThrow(this.#currentScene.next(beatKey));
	}
	#applySaveDataSideEffects (effects) {
		effects.queuedScenes.forEach(x => this.#currentSave.queueScene(x));
		effects.unlockedChapters.forEach(x => this.#currentSave.unlockChapter(x));
		effects.unlockedAchievements.forEach(x => this.#currentSave.unlockAchievement(x));
		effects.addedItems.forEach(x => this.#currentSave.addInventoryItem(x));
		effects.removedItems.forEach(x => this.#currentSave.removeInventoryItem(x));
		effects.addedMemories.forEach(x => this.#currentSave.addMemoryToCharacter(x));
		effects.removedMemories.forEach(x => this.#currentSave.removeMemoryFromCharacter(x));
		effects.updatedCharacterTraits.forEach(x => this.#currentSave.updateCharacterTrait(x));
	}
	async restartScene () {
		if (!this.#currentScene) {
			throw new Error('You cannot call restart scene prior to starting a chapter.');
		}
		this.#clearSceneState();
		this.#currentSave = this.#originalSave.clone();
		this.#currentSave.startNewChapter({
			chapterKey: this.#currentChapter.key,
			sceneKey: this.#currentScene.key,
		});
		this.#currentScene = await this.#findSceneElseThrow(this.#currentChapter.start());
		return this.#playBeatOrThrow(this.#currentScene.start());
	}
	async completeScene () {
		if (!this.#currentScene) {
			throw new Error('You cannot call complete scene prior to starting a chapter.');
		}
		if (!this.#currentScene.isComplete) {
			throw new Error('You cannot call complete scene while the scene is in progress.');
		}
		const nextScene = this.#currentSave.getQueuedSceneForChapter(this.#currentChapter.key);
		if (this.#currentScene.key === nextScene || nextScene === '') {
			this.#currentSave.completeChapter(this.#currentChapter.key);
		}
		await this.#savedDataRepo.autosave(this.#currentSave);
		this.#refreshSave(this.#currentSave);
		this.#clearSceneState();
		this.#currentChapter = undefined;
		this.#currentScene = undefined;
	}
	#playBeatOrThrow (beat) {
		if (!beat) {
			throw this.#currentScene.hasBeatReference()
				? new Error('Requested Beat is missing from the Scene data.')
				: new Error(`Requested Beat isn't a real beat.`);
		}
		const result = beat.play({
			characters: this.#currentSave.characters,
			inventory: this.#currentSave.inventory,
			scene: this.#sceneState,
		});
		this.#applySaveDataSideEffects(result.saveData);
		if (_hasSceneData(result)) {
			this.#updateSceneState(result.sceneData);
		} else if (result.default?.sceneData) {
			this.#updateSceneState(result.default.sceneData);
		}
		return result;
		function _hasSceneData (result) {
			return Object.hasOwn(result, 'sceneData');
		}
	}
	#clearSceneState () {
		this.#sceneState = { characters: new Set() };
	}
	#updateSceneState (display) {
		if (display.addCharacters) {
			display.addCharacters.forEach((x) => this.#sceneState.characters.add(x.character));
		}
		if (display.removeCharacters) {
			display.removeCharacters.forEach((x) => this.#sceneState.characters.delete(x.character));
		}
	}
	async save () {
		if (!this.#currentSave) {
			throw new Error('You cannot save data prior to loading save data.');
		}
		await this.#savedDataRepo.save(this.#currentSave);
	}
}
