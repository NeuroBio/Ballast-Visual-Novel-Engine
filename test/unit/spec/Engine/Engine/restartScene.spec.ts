import { Fakes } from '../../../fakes/index';
import { NARRATOR } from '../../../../../src/Beat/Beat';
import { Engine } from '../../../../../src/Engine/Engine';
import { CharacterData, SavedDataData } from '../../../../fake-data/TestData';

describe(`Engine.restart`, () => {
	const Error = Object.freeze({
		TOO_EARLY: 'You cannot call restart scene prior to starting a chapter.',
	});
	const firstBeatKey = 'firstBeat';
	const firstBeatDto = {
		key: firstBeatKey,
		responses: [
			{ text: 'response 1' },
			{ text: 'response 2' },
		],
		defaultBehavior: { text: 'no play', nextBeat: 'no play' },
	};
	const sceneDto = {
		beats: [firstBeatDto],
		firstBeatKey,
		name: 'Scene Name',
		key: 'sceneKey',
	};
	const chapterDto = {
		key: 'chapKey',
		name: 'chap',
		locked: false,
		firstSceneKey: sceneDto.key,
		sceneKeys: [sceneDto.key],
	};

	let savedDataRepoFake: any, characterTemplateFinderFake: any;
	async function _createEngine (): Promise<Engine> {
		savedDataRepoFake = new Fakes.SavedDataRepo();
		savedDataRepoFake.findOrCreate.mockReturnValueOnce(new Fakes.SavedData());
		characterTemplateFinderFake = new Fakes.CharacterTemplateFinder();
		const engine = new Engine({
			findChapterData: () => Promise.resolve([chapterDto]),
			findSceneData: () => Promise.resolve([sceneDto]),
			findCharacterData: () => Promise.resolve(CharacterData),
			findSavedData: () => Promise.resolve(SavedDataData),
			saveSavedData: () => Promise.resolve(),
			characterTemplateFinder: characterTemplateFinderFake,
			savedDataRepo: savedDataRepoFake,
			// intentionally using the real scene and chapter finders for this
		});
		return engine;
	}

	describe(`current scene is set`, () => {
		it(`recreates the scene with fresh beat data to reset multi-response beats`, async () => {
			const engine = await _createEngine();

			const firstResponse = await engine.startChapter({ chapterKey: chapterDto.key });
			expect(firstResponse).toEqual({
				text: firstBeatDto.responses[0].text,
				nextBeat: firstBeatKey,
				speaker: NARRATOR,
				sceneData: expect.any(Object),
				saveData: expect.any(Object),
			});

			const secondResponse = engine.advanceScene({ beatKey: firstBeatKey });
			expect(secondResponse).toEqual({
				text: firstBeatDto.responses[1].text,
				nextBeat: firstBeatDto.defaultBehavior.nextBeat,
				speaker: NARRATOR,
				sceneData: expect.any(Object),
				saveData: expect.any(Object),
			});


			const replayResponse = await engine.restartScene();
			expect(replayResponse).toEqual({
				text: firstBeatDto.responses[0].text,
				nextBeat: firstBeatKey,
				speaker: NARRATOR,
				sceneData: expect.any(Object),
				saveData: expect.any(Object),
			});
		});
	});
	describe(`current scene is not set`, () => {
		it(`throws an error`, async () => {
			const engine = await _createEngine();
			await expect(
				async () => await engine.restartScene(),
			).rejects.toThrow(Error.TOO_EARLY);
		});
	});
});
