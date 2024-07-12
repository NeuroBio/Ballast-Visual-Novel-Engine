import { NARRATOR } from '../../../src/Beat/Beat';
import { Engine } from '../../../src/Engine/Engine';
import { BeatData, ChapterData, SceneData } from '../../unit/FakeData/TestData';

describe(`playing through the test data without save data`, () => {
	const engine = new Engine({
		findChapterData: () => Promise.resolve(ChapterData),
		findSceneData: () => Promise.resolve(SceneData),
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
		console.log('start');
		engine.loadSavedData();
	});
	it(`plays the first beat`, async () => {
		const start = await engine.startChapter({ chapterKey });
		result.set(start);
		expect(result.get()).toEqual({
			nextBeat: BeatData[0].nextBeat,
			text: `${NARRATOR}: ${BeatData[0].text}`,
		});
	});
	it(`plays the second beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({
			nextBeat: BeatData[1].nextBeat,
			text: `${NARRATOR}: ${BeatData[1].text}`,
		});
	});
	it(`plays the third beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({ choices: BeatData[2].choices });
	});
	it(`plays the beat from choice 2`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().choices[1].nextBeat }));
		expect(result.get()).toEqual({
			nextBeat: BeatData[4].nextBeat,
			text: `${NARRATOR}: ${BeatData[4].text}`,
		});
	});
	it(`plays the final beat`, () => {
		result.set(engine.advanceScene({ beatKey: result.get().nextBeat }));
		expect(result.get()).toEqual({ text: `${NARRATOR}: ${BeatData[6].text}` });
	});
});
