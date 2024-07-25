import { NARRATOR } from '../../../src/Beat/Beat';
import { BeatDto } from '../../../src/Beat/BeatFactory';
import { ChapterDto } from '../../../src/Chapter/ChapterFinder';
import { CharacterTemplate } from '../../../src/Character/CharacterTemplateFinder';
import { Engine } from '../../../src/Engine/Engine';
import { SavedDataDto } from '../../../src/SavedData/SaveDataRepo';
import { SceneDto } from '../../../src/Scene/SceneFinder';

describe(`playing beats with save data side effects`, () => {
	const characterData: CharacterTemplate[] = [
		{
			name: 'firsto',
			key: '1',
			traits: {},
		},
		{
			name: 'seconda',
			key: '2',
			traits: {
				sparrow: 0.5,
				falcon: 0.3,
			},
		},
	];
	const beatData: BeatDto[] = [
		{
			key: 'A',
			defaultBehavior: {
				text: '1st to play',
				nextBeat: 'B',
			},
			saveDataSideEffects: {
				unlockedChapters: ['chapUnlock'],
			},
		},
		{
			key: 'B',
			defaultBehavior: {
				text: '2nd to play',
				nextBeat: 'C',
			},
			saveDataSideEffects: {
				unlockedAchievements: ['achieveUnlock'],
			},
		},
		{
			key: 'C',
			defaultBehavior: {
				text: '3rd to play',
				nextBeat: 'D',
			},
			saveDataSideEffects: {
				queuedScenes: [{ chapterKey: 'leChap', sceneKey: 'leScene2' }],
			},
		},
		{
			key: 'D',
			defaultBehavior: {
				text: '4th to play',
				nextBeat: 'E',
			},
			saveDataSideEffects: {
				addedItems: [{ item: 'itemAdded', quantity: 2 }],
			},
		},
		{
			key: 'E',
			defaultBehavior: {
				text: '5th to play',
				nextBeat: 'F',
			},
			saveDataSideEffects: {
				removedItems: [{ item: 'removeItem1', quantity: 1 }],
			},
		},
		{
			key: 'F',
			defaultBehavior: {
				text: '6th to play',
				nextBeat: 'G',
			},
			saveDataSideEffects: {
				addedMemories: [
					{ character: characterData[1].key, memory: 'memAdded' },
					{ character: characterData[1].key, memory: 'memAddedToRemove' },
				],
			},
		},
		{
			key: 'G',
			defaultBehavior: {
				text: '7th to play',
				nextBeat: 'H',
			},
			saveDataSideEffects: {
				removedMemories: [{ character: characterData[1].key, memory: 'memAddedToRemove' }],
			},
		},
		{
			key: 'H',
			defaultBehavior: {
				text: '8th to play',
				nextBeat: 'I',
			},
			saveDataSideEffects: {
				updatedCharacterTraits: [{ character: characterData[0].key, trait: 'coolness', change: 0.54 }],
			},
		},
	];
	const sceneData: SceneDto[] = [{
		key: 'leScene',
		name: 'something occurred!',
		firstBeatKey: beatData[0].key,
		beats: beatData,
	}];
	const chapterData: ChapterDto[] = [{
		name: 'leSeriesOfScenes',
		key: 'leChap',
		locked: false,
		firstSceneKey: sceneData[0].key,
		sceneKeys: [sceneData[0].key],
	}];
	const savedData: SavedDataDto = {
		activeChapters: { [chapterData[0].key]: sceneData[0].key },
		unlockedChapters: [ ],
		completedChapters: [ ],
		inventory: {
			removeItem1: 1,
			removeItem2: 2,
		},
		achievements: [],
		characters: [],
	};
	const saveSavedData = jest.fn();
	const engine = new Engine({
		findChapterData: () => Promise.resolve(chapterData),
		findSceneData: () => Promise.resolve(sceneData),
		findCharacterData: () => Promise.resolve(characterData),
		findSavedData: () => Promise.resolve(savedData),
		saveSavedData,
	});
	let priorResult: any;
	const defaultSaveData = {
		queuedScenes: [],
		unlockedChapters: [],
		unlockedAchievements: [],
		addedItems: [],
		removedItems: [],
		addedMemories: [],
		removedMemories: [],
		updatedCharacterTraits: [],
	};
	const currentSave = { ...savedData, characters: characterData.map((x) => ({ ...x, memories: [] as string[] })) };
	const result = {
		get: () => priorResult,
		set (newResult: any) {
			console.debug(newResult.message || newResult.choices || newResult);
			priorResult = newResult;
		},
	};
	it(`plays the first beat that unlocks a chapter`, async () => {
		const start = await engine.startChapter({ chapterKey: chapterData[0].key });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[0].defaultBehavior!.nextBeat,
			text: beatData[0].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: {
				...defaultSaveData,
				unlockedChapters: beatData[0].saveDataSideEffects!.unlockedChapters,
			},
		});
	});
	it(`save data includes the unlocked chapter`, async () => {
		await engine.save();
		currentSave.unlockedChapters.push(...beatData[0].saveDataSideEffects!.unlockedChapters!);
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the second beat that unlocks a achievement`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[1].defaultBehavior!.nextBeat,
			text: beatData[1].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: {
				...defaultSaveData,
				unlockedAchievements: beatData[1].saveDataSideEffects!.unlockedAchievements,
			},
		});
	});
	it(`save data includes the unlocked achievement`, async () => {
		await engine.save();
		currentSave.achievements.push(...beatData[1].saveDataSideEffects!.unlockedAchievements!);
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the third beat that queues a scene`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[2].defaultBehavior!.nextBeat,
			text: beatData[2].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: {
				...defaultSaveData,
				queuedScenes: beatData[2].saveDataSideEffects!.queuedScenes,
			},
		});
	});
	it(`save data includes the queued scene`, async () => {
		await engine.save();
		currentSave.activeChapters = { [chapterData[0].key]: beatData[2].saveDataSideEffects!.queuedScenes![0].sceneKey };
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the fourth beat that adds an item`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[3].defaultBehavior!.nextBeat,
			text: beatData[3].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: {
				...defaultSaveData,
				addedItems: beatData[3].saveDataSideEffects!.addedItems,
			},
		});
	});
	it(`save data includes added item`, async () => {
		await engine.save();
		currentSave.inventory[beatData[3].saveDataSideEffects!.addedItems![0].item] = beatData[3].saveDataSideEffects!.addedItems![0].quantity;
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the fifth beat that removes an item`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[4].defaultBehavior!.nextBeat,
			text: beatData[4].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: {
				...defaultSaveData,
				removedItems: beatData[4].saveDataSideEffects!.removedItems,
			},
		});
	});
	it(`save data excludes removed item`, async () => {
		await engine.save();
		delete currentSave.inventory[beatData[4].saveDataSideEffects!.removedItems![0].item];
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the sixth beat that adds two memories`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[5].defaultBehavior!.nextBeat,
			text: beatData[5].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: {
				...defaultSaveData,
				addedMemories: beatData[5].saveDataSideEffects!.addedMemories,
			},
		});
	});
	it(`save data includes the two memories`, async () => {
		await engine.save();
		const character = currentSave.characters.find((x) => x.key === beatData[5].saveDataSideEffects!.addedMemories![0].character);
		character!.memories.push(...beatData[5].saveDataSideEffects!.addedMemories!.map(x => x.memory));
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the seventh beat that removes a memory`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[6].defaultBehavior!.nextBeat,
			text: beatData[6].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: {
				...defaultSaveData,
				removedMemories: beatData[6].saveDataSideEffects!.removedMemories,
			},
		});
	});
	it(`save data excludes removed memory`, async () => {
		await engine.save();
		const character = currentSave.characters.find((x) => x.key === beatData[6].saveDataSideEffects!.removedMemories![0].character);
		character!.memories = character!.memories.filter((x => x !== beatData[6].saveDataSideEffects!.removedMemories![0].memory));
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the eighth beat that changes a character trait`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[7].defaultBehavior!.nextBeat,
			text: beatData[7].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: {
				...defaultSaveData,
				updatedCharacterTraits: beatData[7].saveDataSideEffects!.updatedCharacterTraits,
			},
		});
	});
	it(`save data respects character trait changes`, async () => {
		await engine.save();
		const character = currentSave.characters.find((x) => x.key === beatData[7].saveDataSideEffects!.updatedCharacterTraits![0].character);
		character!.traits[beatData[7].saveDataSideEffects!.updatedCharacterTraits![0].trait] = beatData[7].saveDataSideEffects!.updatedCharacterTraits![0].change;
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
});
