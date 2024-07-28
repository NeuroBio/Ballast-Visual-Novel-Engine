const CharacterTemplates = [
	{
		name: 'The Reptile',
		key: 'reptile',
		traits: {},
	},
	{
		name: 'Terrible Hunter Cat',
		key: 'cat',
		traits: {},
	},
	{
		name: 'Emperor Cat',
		key: 'king',
		traits: {},
	},
	{
		name: 'Generic Lackey Cat',
		key: 'lackey',
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
			text: `Another simple beat.  This one includes data to set the scene.  We now have a reptile (you) in the backyard teasing a cat (not you) that cannot reach it.`,
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
			text: `Let's get into some logic.  The next beat is a Choice beat, which drives immediate, user-decision story branching.`,
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
	{
		key: 'E',
		defaultBehavior: {
			text: 'The reptile successfully swiped anti-cat-spray from the cat!  Why did the cat have that in the first place...',
			nextBeat: 'G',
		},
		saveData: {
			addedItems: [{ item: 'catRepellant', quantity: 1 }],
		},
	},
	{
		key: 'F',
		defaultBehavior: {
			text: 'The reptile lolled its sticky tongue at the cat.  The cat was infuriated',
			nextBeat: 'G',
		},
		saveData: {
			unlockedAchievements: ['Snark-izard'],
		},
	},
	{
		key: 'TheLast',
		defaultBehavior: {
			text: 'This is the last beat!  You can now click Complete Chapter to finish up and make Start Chapter an available action again.',
		},
	},
	{
		key: 'G',
		defaultBehavior: {
			text: 'Regardless of what you chose, you ended up here.  However, each choice had different effects on the save data.  This will affect the choices available next.',
			nextBeat: 'H',
		},
	},
	{
		key: 'H',
		choices: [
			{
				text: 'Use cat repellent',
				nextBeat: 'I',
				conditions: [{ type: 'itemEqual+', item: 'catRepellant', quantity: 1 }],
			},
			{
				text: 'Stare at cat with unblinking, slit eyes.',
				nextBeat: 'J',
			},
			{
				text: 'Stick tongue out further.',
				nextBeat: 'K',
				conditions: [{ type: 'itemEqual-', item: 'catRepellant', quantity: 0 }],
			},
		],
	},
	{
		key: 'I',
		defaultBehavior: {
			text: 'The lizard somehow sprayed the cat repellent all over the cat!  The cat runs off yowling.',
			nextBeat: 'L',
			sceneData: {
				removeCharacters: [{ character: CharacterTemplates[1].key }],
			},
		},
		saveData: {
			removedItems: [{ item: 'catRepellant', quantity: 1 }],
		},
	},
	{
		key: 'J',
		defaultBehavior: {
			character: CharacterTemplates[1].key,
			text: 'I can still see you...',
			nextBeat: 'M1',
		},
	},
	{
		key: 'K',
		defaultBehavior: {
			text: 'The lizard sticks its tongue out further.  And further.  AND FURTHER.  Its tongue got stuck...',
			nextBeat: 'N1',
		},
	},
	{
		key: 'L',
		defaultBehavior: {
			text: 'Unfortunately, all that commotion attracted two more cats...',
			nextBeat: '',
			sceneData: {
				addCharacters: [
					{ character: CharacterTemplates[2].key, position: 2, sprite: 'regal' },
					{ character: CharacterTemplates[3].key, position: 3, sprite: 'such-a-simp' },
				],
			},
		},
	},
	{
		key: 'M1',
		defaultBehavior: {
			text: 'The Lizard remains still.',
			nextBeat: 'M2',
		},
	},
	{
		key: 'M2',
		defaultBehavior: {
			character: CharacterTemplates[1].key,
			text: 'You cannot trick me!',
			nextBeat: 'M3',
		},
	},
	{
		key: 'M3',
		choices: [
			{
				text: 'Remain Still',
				nextBeat: 'M4',
			},
			{
				text: 'Blep tongue at cat.',
				nextBeat: 'M5',
			},
		],
	},
	{
		key: 'M4',
		defaultBehavior: {
			character: CharacterTemplates[1].key,
			text: 'Did... did it die?  It must be dead...',
			nextBeat: 'M6',
		},
	},
	{
		key: 'M5',
		defaultBehavior: {
			character: CharacterTemplates[1].key,
			text: 'YOU SHALL PAY FOR YOUR INSUBORDINATION!',
			nextBeat: 'O',
		},
	},
	{
		key: 'M6',
		defaultBehavior: {
			character: CharacterTemplates[1].key,
			text: 'Bored, the cat wanders off without making a racket.',
			nextBeat: 'O',
			sceneData: {
				removeCharacters: [{ character: CharacterTemplates[1].key }],
			},
		},
	},
	{
		key: 'N1',
		defaultBehavior: {
			text: 'Snorting, the cat covers its face with its paws.',
			nextBeat: 'N2',
		},
	},
	{
		key: 'N2',
		defaultBehavior: {
			character: CharacterTemplates[1].key,
			text: 'Boss, come here and get a load of this!',
			nextBeat: 'N3',
		},
	},
	{
		key: 'N3',
		defaultBehavior: {
			text: 'A regal cat wonders over to investigate.',
			nextBeat: 'O',
			sceneData: {
				addCharacters: [
					{ character: CharacterTemplates[2].key, position: 2, sprite: 'regal' },
				],
			},
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