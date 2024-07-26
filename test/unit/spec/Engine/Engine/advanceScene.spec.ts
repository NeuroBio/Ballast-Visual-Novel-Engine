import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, CharacterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';
import { SavedData } from '../../../fakes/SavedData';
import { Scene } from '../../../fakes/Scene';

describe(`Engine.advanceScene`, () => {
	const Error = Object.freeze({
		TOO_EARLY: 'You cannot call advance scene prior to starting a chapter.',
	});
	const saveData = Object.freeze({
		queuedScenes: [],
		unlockedChapters: [],
		unlockedAchievements: [],
		addedItems: [],
		removedItems: [],
		addedMemories: [],
		removedMemories: [],
		updatedCharacterTraits: [],
	});
	let chapterFinderFake: any, sceneFinderFake: any, scene: Scene, savedData: SavedData,
		characterTemplateFinderFake: any, savedDataRepoFake: any;
	async function _createEngine (): Promise<Engine> {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
		const chapter = new Fakes.Chapter();
		const playResponse = { text: 'result', nextBeat: 'beater', saveData };
		const beat = new Fakes.SimpleBeat({ key: 'key', saveData });
		beat.play.mockReturnValueOnce(playResponse);
		scene = new Fakes.Scene();
		scene.start.mockReturnValueOnce(beat);
		chapterFinderFake.byKey.mockReturnValueOnce(chapter);
		sceneFinderFake.byKey.mockReturnValueOnce(scene);
		savedData = new Fakes.SavedData();
		savedDataRepoFake.findOrCreate.mockReturnValueOnce(savedData);
		characterTemplateFinderFake = new Fakes.CharacterTemplateFinder();
		const engine = new Engine({
			findChapterData: () => Promise.resolve(ChapterData),
			findSceneData: () => Promise.resolve(SceneData),
			findCharacterData: () => Promise.resolve(CharacterData),
			findSavedData: () => Promise.resolve(SavedDataData),
			saveSavedData: () => Promise.resolve(),
			characterTemplateFinder: characterTemplateFinderFake,
			chapterFinder: chapterFinderFake,
			sceneFinder: sceneFinderFake,
			savedDataRepo: savedDataRepoFake,
		});
		await engine.startChapter({ chapterKey: '' });
		return engine;
	}
	describe(`called before setting a scene`, () => {
		it(`throws an error`, () => {
			chapterFinderFake = new Fakes.ChapterFinder();
			sceneFinderFake = new Fakes.SceneFinder();
			savedDataRepoFake = new Fakes.SavedDataRepo();
			const engine = new Engine({
				findChapterData: () => Promise.resolve(ChapterData),
				findSceneData: () => Promise.resolve(SceneData),
				findSavedData: () => Promise.resolve(SavedDataData),
				findCharacterData: () => Promise.resolve(CharacterData),
				saveSavedData: () => Promise.resolve(),
				chapterFinder: chapterFinderFake,
				sceneFinder: sceneFinderFake,
				savedDataRepo: savedDataRepoFake,
			});
			const beatKey = 'beatKey';
			expect(() => {
				engine.advanceScene({ beatKey });
			}).toThrow(Error.TOO_EARLY);
		});
	});
	describe(`playing a beat with a next beat and no side effects`, () => {
		const beatKey = 'beatKey';
		const newBeat = new Fakes.SimpleBeat({ key: 'key', saveData });
		const playResponse = { text: 'result', nextBeat: 'beater', saveData: saveData };
		let result: any;

		beforeAll(async () => {
			const engine = await _createEngine();
			newBeat.play.mockReturnValueOnce(playResponse);
			scene.next.mockReturnValueOnce(newBeat);
			result = engine.advanceScene({ beatKey });
		});
		it(`does not play the scene's next beat`, () => {
			expect(scene.next).toHaveBeenCalled();
			expect(newBeat.play).toHaveBeenCalled();
		});
		it(`does not queue scenes`, () => {
			expect(savedData.queueScene).not.toHaveBeenCalled();
		});
		it(`does not unlock chapters`, () => {
			expect(savedData.unlockChapter).not.toHaveBeenCalled();
		});
		it(`does not unlock achievements`, () => {
			expect(savedData.unlockAchievement).not.toHaveBeenCalled();
		});
		it(`does not add items`, () => {
			expect(savedData.addInventoryItem).not.toHaveBeenCalled();
		});
		it(`does not remove items`, () => {
			expect(savedData.removeInventoryItem).not.toHaveBeenCalled();
		});
		it(`does not add memories`, () => {
			expect(savedData.addMemoryToCharacter).not.toHaveBeenCalled();
		});
		it(`does not remove memories`, () => {
			expect(savedData.removeMemoryFromCharacter).not.toHaveBeenCalled();
		});
		it(`does not update traits`, () => {
			expect(savedData.updateCharacterTrait).not.toHaveBeenCalled();
		});
		it(`returns the beat data for display`, () => {
			expect(result).toEqual(playResponse);
		});
	});
	describe(`playing a beat without a next beat and all side effects`, () => {
		const beatKey = 'beatKey',
			queuedScenes = [{ chapterKey: 'chap', sceneKey: 'scene' }],
			unlockedChapters = ['chap'],
			unlockedAchievements = ['achieve'],
			addedItems = [{ item: 'item', quantity: 1 }],
			removedItems = [{ item: 'item', quantity: 2 }],
			addedMemories = [{ character: 'char', memory: 'newMem' }],
			removedMemories = [{ character: 'char', memory: 'oldMem' }],
			updatedCharacterTraits = [{ character: 'char', trait: 'feeling', change: 0.002 }] ;

		const saveData = {
			queuedScenes,
			unlockedChapters,
			unlockedAchievements,
			addedItems,
			removedItems,
			addedMemories,
			removedMemories,
			updatedCharacterTraits,
		};
		const newBeat = new Fakes.SimpleBeat({
			key: 'key',
			saveData,
		});
		const playResponse = { text: 'result', saveData: saveData };
		let result: any;

		beforeAll(async () => {
			const engine = await _createEngine();
			newBeat.play.mockReturnValueOnce(playResponse);
			scene.next.mockReturnValueOnce(newBeat);
			result = engine.advanceScene({ beatKey });
		});
		it(`plays the scene's next beat`, () => {
			expect(scene.next).toHaveBeenCalled();
			expect(newBeat.play).toHaveBeenCalled();
		});
		it(`queues scenes`, () => {
			expect(savedData.queueScene).toHaveBeenCalledWith(queuedScenes[0]);
		});
		it(`unlocks chapters`, () => {
			expect(savedData.unlockChapter).toHaveBeenCalledWith(unlockedChapters[0]);
		});
		it(`unlocks achievements`, () => {
			expect(savedData.unlockAchievement).toHaveBeenCalledWith(unlockedAchievements[0]);
		});
		it(`adds items`, () => {
			expect(savedData.addInventoryItem).toHaveBeenCalledWith(addedItems[0]);
		});
		it(`removes items`, () => {
			expect(savedData.removeInventoryItem).toHaveBeenCalledWith(removedItems[0]);
		});
		it(`adds memories`, () => {
			expect(savedData.addMemoryToCharacter).toHaveBeenCalledWith(addedMemories[0]);
		});
		it(`removes memories`, () => {
			expect(savedData.removeMemoryFromCharacter).toHaveBeenCalledWith(removedMemories[0]);
		});
		it(`updates traits`, () => {
			expect(savedData.updateCharacterTrait).toHaveBeenCalledWith(updatedCharacterTraits[0]);
		});
		it(`returns the beat data for display`, () => {
			expect(result).toEqual(playResponse);
		});
	});
});
