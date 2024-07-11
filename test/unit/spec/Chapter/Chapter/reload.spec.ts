import { Chapter } from '../../../../../src/Chapter/Chapter';
import { Fakes } from '../../../fakes/index';

xdescribe(`Chapter.reload`, () => {
	describe(`locked chapter was neither unlocked nor played`, () => {
		it(`leaves the chapter locked`, () => {
			const firstSceneKey = 'firstScene';
			const secondSceneKey = 'secondScene';
			const chapter = new Chapter({
				key: 'chap',
				name: 'a chapter',
				sceneKeys: [ firstSceneKey, secondSceneKey ],
				locked: true,
				firstSceneKey,
			});
			const savedData = new Fakes.SavedData();

			// @ts-expect-error mocking class with private members
			chapter.reload(savedData);
			expect(chapter.isLocked()).toBe(true);
		});
	});
	describe(`locked chapter was unlocked but was not played`, () => {
		it(`unlocks the chapter`, () => {
			const firstSceneKey = 'firstScene';
			const secondSceneKey = 'secondScene';
			const chapter = new Chapter({
				key: 'chap',
				name: 'a chapter',
				sceneKeys: [ firstSceneKey, secondSceneKey ],
				locked: true,
				firstSceneKey,
			});
			const savedData = new Fakes.SavedData();

			// @ts-expect-error mocking class with private members
			chapter.reload(savedData);
			expect(chapter.isLocked()).toBe(false);
		});
	});
	describe(`locked chapter was unlocked and is the current chapter`, () => {
		it(`unlocks the chapter`, () => {
			const firstSceneKey = 'firstScene';
			const secondSceneKey = 'secondScene';
			const chapter = new Chapter({
				key: 'chap',
				name: 'a chapter',
				sceneKeys: [ firstSceneKey, secondSceneKey ],
				locked: true,
				firstSceneKey,
			});
			const savedData = new Fakes.SavedData();

			// @ts-expect-error mocking class with private members
			chapter.reload(savedData);
			expect(chapter.isLocked()).toBe(false);
		});
	});
	describe(`locked chapter was unlocked and played`, () => {
		it(`unlocks the chapter`, () => {
			const firstSceneKey = 'firstScene';
			const secondSceneKey = 'secondScene';
			const chapter = new Chapter({
				key: 'chap',
				name: 'a chapter',
				sceneKeys: [ firstSceneKey, secondSceneKey ],
				locked: true,
				firstSceneKey,
			});
			const savedData = new Fakes.SavedData();

			// @ts-expect-error mocking class with private members
			chapter.reload(savedData);
			expect(chapter.isLocked()).toBe(false);
		});
	});
});
