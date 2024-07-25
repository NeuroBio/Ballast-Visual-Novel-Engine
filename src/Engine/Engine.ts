import { Beat, ChoiceBeatDisplay, FinalBeatDisplay, SaveDataSideEffects, StandardBeatDisplay } from '../Beat/Beat';
import { Chapter } from '../Chapter/Chapter';
import { ChapterDto, ChapterFinder } from '../Chapter/ChapterFinder';
import { CharacterTemplate, CharacterTemplateFinder } from '../Character/CharacterTemplateFinder';
import { SavedDataDto, SavedDataRepo } from '../SavedData/SaveDataRepo';
import { SavedData } from '../SavedData/SavedData';
import { Scene } from '../Scene/Scene';
import { SceneDto, SceneFinder } from '../Scene/SceneFinder';

interface EngineParams {
	findChapterData: (key?: string) => Promise<ChapterDto[]>;
	findSceneData: (key?: string) => Promise<SceneDto[]>;
	findCharacterData: () => Promise<CharacterTemplate[]>;
	findSavedData: () => Promise<SavedDataDto | void>;
	createSavedData?: () => Promise<SavedDataDto>;
	saveSavedData: (saveData: SavedDataDto) => Promise<void>;
	autosaveSaveData?: (saveData: SavedDataDto) => Promise<void>;
	chapterFinder?: ChapterFinder;
	sceneFinder?: SceneFinder;
	savedDataRepo?: SavedDataRepo;
	characterTemplateFinder?: CharacterTemplateFinder;
}
interface LoadChapterParams {
	chapterKey: string
}

interface AdvanceSceneParams {
	beatKey: string;
}

interface getChaptersParams {
	excludeLocked?: boolean;
	excludeUnlocked?: boolean;
}

interface SceneState {
	characters: Set<string>;
}

type DisplayData = StandardBeatDisplay | ChoiceBeatDisplay | FinalBeatDisplay;
export class Engine {
	#chapterFinder: ChapterFinder;
	#sceneFinder: SceneFinder;
	#characterTemplateFinder: CharacterTemplateFinder;
	#savedDataRepo: SavedDataRepo;

	#originalSave: SavedData;
	#currentSave: SavedData;
	#currentChapter: Chapter;
	#currentScene: Scene;
	#sceneState: SceneState;

	constructor (params: EngineParams) {
		const { findChapterData, findSceneData, findSavedData, findCharacterData,
			createSavedData, saveSavedData, autosaveSaveData } = params;
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

	async loadSavedData (): Promise<void> {
		const latestSaveData = await this.#savedDataRepo.findOrCreate();
		const characterTemplates = await this.#characterTemplateFinder.all();
		latestSaveData.addMissingCharacters(characterTemplates);
		this.#refreshSave(latestSaveData);
	}

	#refreshSave (latestSaveData: SavedData): void {
		this.#originalSave = latestSaveData;
		this.#currentSave = this.#originalSave.clone();
	}

	async getChapters (params: getChaptersParams = {}): Promise<Chapter[]> {
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

	async startChapter (params: LoadChapterParams): Promise<DisplayData> {
		const { chapterKey } = params;

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

		const beat = this.#currentScene.start();
		return this.#playBeat(beat);
	}

	async #findChapterElseThrow (chapterKey: string): Promise<Chapter> {
		const chapter = await this.#chapterFinder.byKey(chapterKey);

		if (!chapter) {
			throw new Error('Requested chapter was not found.');
		}

		chapter.reload(this.#currentSave.getChapterData(chapter.key));
		return chapter;
	}

	async #findSceneElseThrow (sceneKey: string): Promise<Scene> {
		const scene = await this.#sceneFinder.byKey(sceneKey);

		if (!scene) {
			throw new Error('Requested scene was not found.');
		}

		return scene;
	}

	advanceScene (params: AdvanceSceneParams): DisplayData {
		if (!this.#currentScene) {
			throw new Error('You cannot call advance scene prior to starting a chapter.');
		}

		const { beatKey } = params;
		const beat = this.#currentScene.next(beatKey);
		return this.#playBeat(beat);
	}

	#applySaveDataSideEffects (effects: SaveDataSideEffects): void {
		effects.queuedScenes.forEach(x => this.#currentSave.queueScene(x));
		effects.unlockedChapters.forEach(x => this.#currentSave.unlockChapter(x));
		effects.unlockedAchievements.forEach(x => this.#currentSave.unlockAchievement(x));
		effects.addedItems.forEach(x => this.#currentSave.addInventoryItem(x));
		effects.removedItems.forEach(x => this.#currentSave.removeInventoryItem(x));
		effects.addedMemories.forEach(x => this.#currentSave.addMemoryToCharacter(x));
		effects.removedMemories.forEach(x => this.#currentSave.removeMemoryFromCharacter(x));
		effects.updatedCharacterTraits.forEach(x => this.#currentSave.updateCharacterTrait(x));
	}

	restartScene (): DisplayData {
		this.#clearSceneState();
		this.#currentSave = this.#originalSave.clone();
		this.#currentSave.startNewChapter({
			chapterKey: this.#currentChapter.key,
			sceneKey: this.#currentScene.key,
		});

		const beat = this.#currentScene.start();
		return this.#playBeat(beat);
	}

	async completeScene (): Promise<void> {
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
	}

	#playBeat (beat: Beat): DisplayData {
		const result = beat.play({
			characters: this.#currentSave.characters,
			inventory: this.#currentSave.inventory,
			scene: this.#sceneState,
		});
		this.#applySaveDataSideEffects(result.saveData);
		this.#updateSceneState(result);
		return result;
	}

	#clearSceneState (): void {
		this.#sceneState = { characters: new Set() };
	}

	#updateSceneState (display: DisplayData): void {
		if (!_canAffectDisplayData(display)) {
			return;
		}

		if (display.addCharacters) {
			display.addCharacters.forEach((x) =>
				this.#sceneState.characters.add(x.character));
		}
		if (display.removeCharacters) {
			display.removeCharacters.forEach((x) =>
				this.#sceneState.characters.delete(x.character));
		}

		function _canAffectDisplayData (display: DisplayData): display is StandardBeatDisplay | FinalBeatDisplay {
			return (!!display && (Object.hasOwn(display, 'addCharacters') || Object.hasOwn(display, 'removeCharacters')));
		}
	}

	async save (): Promise<void> {
		if (!this.#currentSave) {
			throw new Error('You cannot save data prior to loading save data.');
		}

		await this.#savedDataRepo.save(this.#currentSave);
	}
}