import { NARRATOR } from '../../../../src/Beat/Beat';
import { Engine } from '../../../../src/Engine/Engine';

describe(`playing through the test data`, () => {
	const engine = new Engine();
	const chapterKey = 'firstChapter';
	const results: any = {};
	it(`plays the first beat`, () => {
		results[1] = engine.startChapter({ chapterKey });
		expect(results[1]).toEqual({
			nextBeat: 'lastBeat',
			text: `${NARRATOR}: test text`,
		});
	});
	it(`plays the second beat`, () => {
		results[2] = engine.advanceScene({ beatKey: results[1].nextBeat });
		expect(results[2]).toEqual({
			text: `${NARRATOR}: final test text`,
		});
	});
});
