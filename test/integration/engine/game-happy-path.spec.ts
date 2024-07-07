import { NARRATOR } from '../../../src/Beat/Beat';
import { Engine } from '../../../src/Engine/Engine';
import { BeatData, ChapterData, SceneData } from '../../unit/FakeData/TestData';

describe(`playing through the test data`, () => {
	const engine = new Engine({
		chapterDataFetcher: () => Promise.resolve(ChapterData),
		sceneDataFetcher: () => Promise.resolve(SceneData),
	});
	const chapterKey = 'firstChapter';
	const results: any[] = [];
	it(`plays the first beat`, async () => {
		const start = await engine.startChapter({ chapterKey });
		results.push(start);
		expect(results[0]).toEqual({
			nextBeat: BeatData[0].nextBeat,
			text: `${NARRATOR}: ${BeatData[0].text}`,
		});
	});
	it(`plays the second beat`, () => {
		results.push(engine.advanceScene({ beatKey: results[0].nextBeat }));
		expect(results[1]).toEqual({
			nextBeat: BeatData[1].nextBeat,
			text: `${NARRATOR}: ${BeatData[1].text}`,
		});
	});
	it(`plays the third beat`, () => {
		results.push(engine.advanceScene({ beatKey: results[1].nextBeat }));
		expect(results[2]).toEqual({ choices: BeatData[2].choices });
	});
	it(`plays the beat from choice 2`, () => {
		results.push(engine.advanceScene({ beatKey: results[2].choices[1].nextBeat }));
		expect(results[3]).toEqual({
			nextBeat: BeatData[4].nextBeat,
			text: `${NARRATOR}: ${BeatData[4].text}`,
		});
	});
	it(`plays the final beat`, () => {
		results.push(engine.advanceScene({ beatKey: results[3].nextBeat }));
		expect(results[4]).toEqual({ text: `${NARRATOR}: ${BeatData[6].text}` });
	});
	it(`console logs the results for posterity`, () => {
		results.forEach((result: any) => console.debug(result.choices || result));
	});
});
