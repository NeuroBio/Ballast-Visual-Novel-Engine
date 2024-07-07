import { NARRATOR } from '../../../../src/Beat/Beat';
import { Engine } from '../../../../src/Engine/Engine';
import { BeatData, ChapterData, SceneData } from '../../FakeData/TestData';

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
	it(`console logs the results for posterity`, () => {
		results.forEach((result: any) => console.debug(result.text));
	});
});
