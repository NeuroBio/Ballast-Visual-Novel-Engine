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
			unlockedChapters: ['chapUnlock'],
		},
		{
			key: 'B',
			defaultBehavior: {
				text: '2nd to play',
				nextBeat: 'C',
			},
			unlockedAchievements: ['achieveUnlock'],
		},
		{
			key: 'C',
			defaultBehavior: {
				text: '3rd to play',
				nextBeat: 'D',
			},
			queuedScenes: [{ chapterKey: 'leChap', sceneKey: 'leScene2' }],
		},
		{
			key: 'D',
			defaultBehavior: {
				text: '4th to play',
				nextBeat: 'E',
			},
			addedItems: [{ item: 'itemAdded', quantity: 2 }],
		},
		{
			key: 'E',
			defaultBehavior: {
				text: '5th to play',
				nextBeat: 'F',
			},
			removedItems: [{ item: 'removeItem1', quantity: 1 }],
		},
		{
			key: 'F',
			defaultBehavior: {
				text: '6th to play',
				nextBeat: 'G',
			},
			addedMemories: [
				{ character: characterData[1].key, memory: 'memAdded' },
				{ character: characterData[1].key, memory: 'memAddedToRemove' },
			],
		},
		{
			key: 'G',
			defaultBehavior: {
				text: '7th to play',
				nextBeat: 'H',
			},
			removedMemories: [{ character: characterData[1].key, memory: 'memAddedToRemove' }],
		},
		{
			key: 'H',
			defaultBehavior: {
				text: '8th to play',
				nextBeat: 'I',
			},
			updatedCharacterTraits: [{ character: characterData[0].key, trait: 'coolness', change: 0.54 }],
		},
	];
	const sceneData: SceneDto[] = [{
		key: 'leScene',
		name: 'something occurred!',
		locked: false,
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
		});
	});
	it(`save data includes the unlocked chapter`, async () => {
		await engine.save();
		currentSave.unlockedChapters.push(...beatData[0].unlockedChapters!);
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the second beat that unlocks a achievement`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[1].defaultBehavior!.nextBeat,
			text: beatData[1].defaultBehavior!.text,
			speaker: NARRATOR,
		});
	});
	it(`save data includes the unlocked achievement`, async () => {
		await engine.save();
		currentSave.achievements.push(...beatData[1].unlockedAchievements!);
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the third beat that queues a scene`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[2].defaultBehavior!.nextBeat,
			text: beatData[2].defaultBehavior!.text,
			speaker: NARRATOR,
		});
	});
	it(`save data includes the queued scene`, async () => {
		await engine.save();
		currentSave.activeChapters = { [chapterData[0].key]: beatData[2].queuedScenes![0].sceneKey };
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the fourth beat that adds an item`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[3].defaultBehavior!.nextBeat,
			text: beatData[3].defaultBehavior!.text,
			speaker: NARRATOR,
		});
	});
	it(`save data includes added item`, async () => {
		await engine.save();
		currentSave.inventory[beatData[3].addedItems![0].item] = beatData[3].addedItems![0].quantity;
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the fifth beat that removes an item`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[4].defaultBehavior!.nextBeat,
			text: beatData[4].defaultBehavior!.text,
			speaker: NARRATOR,
		});
	});
	it(`save data excludes removed item`, async () => {
		await engine.save();
		delete currentSave.inventory[beatData[4].removedItems![0].item];
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	it(`plays the sixth beat that adds two memories`, () => {
		const start = engine.advanceScene({ beatKey: result.get().nextBeat });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: beatData[5].defaultBehavior!.nextBeat,
			text: beatData[5].defaultBehavior!.text,
			speaker: NARRATOR,
		});
	});
	it(`save data excludes removed item`, async () => {
		await engine.save();
		const character = currentSave.characters.find((x) => x.key === beatData[5].addedMemories![0].character);
		character?.memories.push(...beatData[5].addedMemories!.map(x => x.memory));
		expect(saveSavedData).toHaveBeenCalledWith(currentSave);
	});
	// still have 7 + 8 todo
});
