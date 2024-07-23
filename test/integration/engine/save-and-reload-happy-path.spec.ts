import { NARRATOR } from '../../../src/Beat/Beat';
import { Engine } from '../../../src/Engine/Engine';
import { BeatData, ChapterData, CharacterData, CharacterTemplateData, SceneData } from '../../unit/FakeData/TestData';

describe(`
	playing through the test data without save data
	saving data, restarting, and reloading
`, () => {
	const saveFunction = jest.fn(() => Promise.resolve());
	const engine = new Engine({
		findChapterData: () => Promise.resolve(ChapterData),
		findSceneData: () => Promise.resolve(SceneData),
		findCharacterData: () => Promise.resolve(CharacterData),
		findSavedData: () => Promise.resolve(),
		saveSavedData: saveFunction,
	});
	const chapterKey = 'firstChapter';
	let priorResult: any;
	const result = {
		get: () => priorResult,
		set (newResult: any) {
			console.debug(newResult.message || newResult.choices || newResult);
			priorResult = newResult;
		},
	};
	it(`loads data`, () => {
		console.debug('start no save happy path');
		engine.loadSavedData();
	});
	it(`plays the first beat`, async () => {
		const start = await engine.startChapter({ chapterKey });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: BeatData[0].defaultBehavior!.nextBeat,
			text: BeatData[0].defaultBehavior!.text,
			speaker: NARRATOR,
		});
	});
	it(`plays the second beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({
			nextBeat: BeatData[1].defaultBehavior!.nextBeat,
			text: BeatData[1].defaultBehavior!.text,
			speaker: NARRATOR,
		});
	});
	it(`saves save data`, async () => {
		await engine.save();
		expect(saveFunction).toHaveBeenCalledWith({
			achievements: BeatData[1].unlockedAchievements,
			activeChapters: { [ChapterData[0].key]: SceneData[0].key },
			characters: CharacterTemplateData.map(char => ({ ...char, memories: [] })),
			completedChapters: [],
			inventory: {},
			unlockedChapters: [],
		});
	});
	it(`plays the first beat again on restart`, () => {
		const restart = engine.restartScene();
		result.set(restart);
		expect(result.get()).toEqual({
			nextBeat: BeatData[0].defaultBehavior!.nextBeat,
			text: BeatData[0].defaultBehavior!.text,
			speaker: NARRATOR,
		});
	});
	it(`saves restarted save data`, async () => {
		saveFunction.mockReset();
		await engine.save();
		expect(saveFunction).toHaveBeenCalledWith({
			achievements: [],
			activeChapters: { [ChapterData[0].key]: SceneData[0].key },
			characters: CharacterTemplateData.map(char => ({ ...char, memories: [] })),
			completedChapters: [],
			inventory: {},
			unlockedChapters: [],
		});
	});
});