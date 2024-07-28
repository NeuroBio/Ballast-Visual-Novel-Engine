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
			text: `Let's get into some logic.  The next beat is a Choice beat, which drives immediate user-decision story branching.`,
			nextBeat: 'D',
		},
	},
	{
		key: 'D',
		choices: [
			{
				text: 'Steal an item from cat',
				nextBeat: 'E',
			},
			{
				text: 'Stick lizard tongue out at cat',
				nextBeat: 'F',
			},
		],
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
		allowReplay: true,
		firstSceneKey: Scenes[0].key,
		sceneKeys: Scenes.map(x => x.key),
	},
];

export const DemoData = {
	CharacterTemplates,
	Chapters,
	Scenes,
};