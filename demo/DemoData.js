const CharacterTemplates = [
	{
		name: 'The Reptile',
		key: 'rep',
		traits: {},
	},
];

const Beats = [
	{
		key: 'A',
		text: `The first beat is a simple beat.  It has nothing extra on it.`,
		nextBeat: 'B',
	},
];

const Scenes = [
	{
		key: 'scene1',
		name: 'The First Scene',
		firstBeatKey: Beats[0].key,
		beats: Beats,
	},
];

const Chapters = [
	{
		key: 'chap1',
		name: 'The First Chapter',
		locked: false,
		firstSceneKey: Scenes[0].key,
		sceneKeys: Scenes.map(x => x.key),
	},
];

export const DemoData = {
	CharacterTemplates,
	Chapters,
	Scenes,
};