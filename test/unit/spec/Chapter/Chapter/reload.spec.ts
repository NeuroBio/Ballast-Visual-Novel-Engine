import { Chapter } from '../../../../../src/Chapter/Chapter';

describe(`Chapter.reload`, () => {
	const Error = Object.freeze({
		INVALID_SCENE: 'Tried to restart chapter at an invalid scene.',
		LOCKED: 'This chapter has not yet been unlocked.',
		NO_REPLAY: 'This chapter has already been completed and does not allow replays',
	});

	describe(`locked chapter was neither unlocked nor played`, () => {
		it(`throws error`, () => {
			const firstSceneKey = 'firstScene';
			const secondSceneKey = 'secondScene';
			const chapter = new Chapter({
				key: 'chap',
				name: 'a chapter',
				sceneKeys: [ firstSceneKey, secondSceneKey ],
				locked: true,
				firstSceneKey,
			});
			const savedData = {
				isUnlocked: false,
				wasCompleted: false,
				queuedScene: '',
			};

			expect(() => {
				chapter.reload(savedData);
			}).toThrow(Error.LOCKED);
		});
	});
	describe(`unlocked chapter was neither unlocked nor played`, () => {
		it(`leaves the chapter locked`, () => {
			const firstSceneKey = 'firstScene';
			const secondSceneKey = 'secondScene';
			const chapter = new Chapter({
				key: 'chap',
				name: 'a chapter',
				sceneKeys: [ firstSceneKey, secondSceneKey ],
				locked: false,
				firstSceneKey,
			});
			const savedData = {
				isUnlocked: false,
				wasCompleted: false,
				queuedScene: '',
			};

			chapter.reload(savedData);
			expect(chapter.isLocked).toBe(false);
			expect(chapter.start()).toBe(firstSceneKey);
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
			const savedData = {
				isUnlocked: true,
				wasCompleted: false,
				queuedScene: '',
			};

			chapter.reload(savedData);
			expect(chapter.isLocked).toBe(false);
			expect(chapter.start()).toBe(firstSceneKey);
		});
	});
	describe(`locked chapter was unlocked, is the current chapter, and queue scene is valid`, () => {
		it(`unlocks the chapter and sets the current scene`, () => {
			const firstSceneKey = 'firstScene';
			const secondSceneKey = 'secondScene';
			const chapter = new Chapter({
				key: 'chap',
				name: 'a chapter',
				sceneKeys: [ firstSceneKey, secondSceneKey ],
				locked: true,
				firstSceneKey,
			});
			const savedData = {
				isUnlocked: true,
				wasCompleted: false,
				queuedScene: secondSceneKey,
			};

			chapter.reload(savedData);
			expect(chapter.isLocked).toBe(false);
			expect(chapter.start()).toBe(secondSceneKey);
		});
	});
	describe(`locked chapter was unlocked, is the current chapter, and queue scene is invalid`, () => {
		it(`throws error`, () => {
			const firstSceneKey = 'firstScene';
			const secondSceneKey = 'secondScene';
			const chapter = new Chapter({
				key: 'chap',
				name: 'a chapter',
				sceneKeys: [ firstSceneKey, secondSceneKey ],
				locked: true,
				firstSceneKey,
			});
			const savedData = {
				isUnlocked: true,
				wasCompleted: false,
				queuedScene: `nah, this ain't real`,
			};

			expect(() => {
				chapter.reload(savedData);
			}).toThrow(Error.INVALID_SCENE);
		});
	});
	describe(`locked chapter was unlocked, completed, and does not allow replays`, () => {
		it(`throws error`, () => {
			const firstSceneKey = 'firstScene';
			const secondSceneKey = 'secondScene';
			const chapter = new Chapter({
				key: 'chap',
				name: 'a chapter',
				sceneKeys: [ firstSceneKey, secondSceneKey ],
				locked: true,
				firstSceneKey,
			});
			const savedData = {
				isUnlocked: true,
				wasCompleted: true,
				queuedScene: '',
			};

			expect(() => {
				chapter.reload(savedData);
			}).toThrow(Error.NO_REPLAY);
		});
	});
	describe(`unlocked chapter was completed and allows replays`, () => {
		it(`leaves the chapter locked`, () => {
			const firstSceneKey = 'firstScene';
			const secondSceneKey = 'secondScene';
			const chapter = new Chapter({
				key: 'chap',
				name: 'a chapter',
				sceneKeys: [ firstSceneKey, secondSceneKey ],
				locked: false,
				firstSceneKey,
				allowReplay: true,
			});
			const savedData = {
				isUnlocked: false,
				wasCompleted: true,
				queuedScene: '',
			};

			chapter.reload(savedData);
			expect(chapter.isLocked).toBe(false);
			expect(chapter.start()).toBe(firstSceneKey);
		});
	});
});
