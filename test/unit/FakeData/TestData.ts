export const ChapterData = [
	{
		key: 'firstChapter',
		name: 'Chapter Name',
		locked: false,
		firstSceneKey: 'sceneKey',
		scenes: ['sceneKey'],
	},
];

export const SceneData = [
	{
		name: 'scene name',
		key: 'sceneKey',
		firstBeatKey: 'firstBeat',
		beats: [
			'firstBeat',
			'lastBeat',
		],
	},
];

export const BeatData = [
	{
		key: 'firstBeat',
		text: 'test text',
		nextBeat: 'beat key',
	},
	{
		key: 'lastBeat',
		text: 'final test text',
	},
];
