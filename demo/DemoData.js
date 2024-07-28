const CharacterTemplates = [
	{
		name: 'The Reptile',
		key: 'reptile',
		traits: {},
	},
	{
		name: 'A Cat Behind A Window',
		key: 'cat',
		traits: {},
	},
];

const Beats = [
	{
		key: 'A',
		defaultBehavior: {
			text: `The first beat is a simple beat.  It has nothing extra on it.`,
			nextBeat: 'B',
		},
	},
	{
		key: 'B',
		defaultBehavior: {
			text: `Another simple beat.  This one includes data to set the scene.`,
			nextBeat: 'C',
			sceneData: {
				addCharacters: [
					{
						character: CharacterTemplates[0].key,
						position: 0,
						sprite: 'gleeful',
					},
					{
						character: CharacterTemplates[1].key,
						position: 1,
						sprite: 'annoyed',
					},
				],
				setBackground: 'The Backyard',
			},
		},
	},
	{
		key: 'C',
		defaultBehavior: {
			text: `And one last simple beat.  This one is spoken by a character though.`,
			nextBeat: 'D',
			character: CharacterTemplates[0].key,
		},
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