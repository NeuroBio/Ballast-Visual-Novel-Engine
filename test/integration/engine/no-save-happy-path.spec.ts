import { NARRATOR } from '../../../src/Beat/Beat';
import { Engine } from '../../../src/Engine/Engine';
import { BeatData, ChapterData, CharacterData, SceneData } from '../../fake-data/TestData';

describe(`playing through the test data without save data`, () => {
	const engine = new Engine({
		findChapterData: () => Promise.resolve(ChapterData),
		findSceneData: () => Promise.resolve(SceneData),
		findCharacterData: () => Promise.resolve(CharacterData),
		findSavedData: () => Promise.resolve(),
		saveSavedData: () => Promise.resolve(),
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
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`plays the second beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({
			nextBeat: BeatData[1].defaultBehavior!.nextBeat,
			text: BeatData[1].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`plays the third beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({
			choices: BeatData[2].choices!.map(x => ({ text: x.text, nextBeat: x.nextBeat, mayPlay: true })),
			saveData: expect.any(Object),
		});
	});
	it(`plays the beat from choice 2`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().choices[1].nextBeat }));
		expect(result.get()).toEqual({
			nextBeat: BeatData[4].defaultBehavior!.nextBeat,
			text: BeatData[4].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`plays the first fit branch 2 beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({
			nextBeat: BeatData[6].branches![1].nextBeat,
			text: BeatData[6].branches![1].text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`plays the best fit branch 2 beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({
			nextBeat: BeatData[7].branches![1].nextBeat,
			text: BeatData[7].branches![1].text,
			speaker: CharacterData[1].name,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`plays the first response in the multi response beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({
			nextBeat: BeatData[8].key,
			text: BeatData[8].responses![0].text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`plays the second response in the multi response beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({
			nextBeat: BeatData[8].key,
			text: BeatData[8].responses![1].text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`plays the third response in the multi response beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({
			nextBeat: BeatData[8].defaultBehavior!.nextBeat,
			text: BeatData[8].responses![2].text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`accidentally returns to the multi response beat`, () => {
		result.set(engine.advanceScene({ beatKey: BeatData[8].key }));
		expect(result.get()).toEqual({
			nextBeat: BeatData[8].defaultBehavior!.nextBeat,
			text: BeatData[8].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`plays the final beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({
			text: BeatData[9].defaultBehavior!.text,
			speaker: NARRATOR,
			saveData: expect.any(Object),
			sceneData: expect.any(Object),
		});
	});
	it(`completes scene and chapter`, () => {
		engine.completeScene();
		console.debug('Completed scene + chapter and saved data.');
	});
});
