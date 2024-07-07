export const ChapterData = [
	{
		key: 'firstChapter',
		name: 'Chapter Name',
		locked: false,
		firstSceneKey: 'sceneKey',
		scenes: ['sceneKey'],
	},
];

export const BeatData = [
	{
		key: 'firstBeat',
		text: 'This is the opening beat.',
		nextBeat: 'lastBeat',
	},
	{
		key: 'lastBeat',
		text: 'This is the closing beat.',
	},
];

export const SceneData = [
	{
		name: 'scene name',
		key: 'sceneKey',
		firstBeatKey: 'firstBeat',
		beats: BeatData,
	},
];

