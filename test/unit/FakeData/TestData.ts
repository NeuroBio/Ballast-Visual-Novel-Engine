import { BeatDto } from '../../../src/Beat/BeatFactory';
import { ChapterDto } from '../../../src/Chapter/ChapterFinder';
import { CharacterDto } from '../../../src/Character/Character';
import { SavedDataDto } from '../../../src/SavedData/SaveDataRepo';
import { SceneDto } from '../../../src/Scene/SceneFinder';

export const ChapterData: ChapterDto[] = [
	{
		key: 'firstChapter',
		name: 'Chapter Name',
		locked: false,
		firstSceneKey: 'sceneKey',
		sceneKeys: ['sceneKey'],
	},
	{
		key: 'secondChapter',
		name: 'Another Chapter Name',
		locked: true,
		firstSceneKey: 'sceneKey',
		sceneKeys: ['sceneKey', 'secondSceneKey'],
	},
];

export const BeatData: BeatDto[] = [
	{
		key: 'firstBeat',
		text: 'This is the opening beat.',
		nextBeat: 'secondBeat',
	},
	{
		key: 'secondBeat',
		text: 'This is the second beat.',
		nextBeat: 'choiceBeat',
	},
	{
		key: 'choiceBeat',
		choices: [
			{

				nextBeat: 'downStream1',
				text: 'This is choice 1',
			},
			{
				nextBeat: 'downStream2',
				text: 'This is choice 2',
			},
			{
				nextBeat: 'downStream3',
				text: 'This is choice 3',
			},
		],
	},
	{
		key: 'downStream1',
		text: 'This is downstream of choice 1.',
		nextBeat: 'lastBeat',
	},
	{
		key: 'downStream2',
		text: 'This is downstream of choice 2.',
		nextBeat: 'lastBeat',
	},
	{
		key: 'downStream3',
		text: 'This is downstream of choice 3.',
		nextBeat: 'lastBeat',
	},
	{
		key: 'lastBeat',
		text: 'This is the final beat.',
	},
];

export const SceneData: SceneDto[] = [
	{
		name: 'scene name',
		key: 'sceneKey',
		firstBeatKey: 'firstBeat',
		locked: false,
		beats: BeatData,
	},
	{
		name: 'another scene name',
		key: 'secondSceneKey',
		firstBeatKey: 'firstBeat',
		locked: false,
		beats: BeatData,
	},
];

export const SavedDataData: SavedDataDto = {
	activeChapters: { secondChapter: 'secondSceneKey' },
	unlockedChapters: ['secondChapter'],
	completedChapters: ['firstChapter'],
	inventory: { item: 3 },
	achievements: ['achievement1'],
	characters: [],
};

export const CharacterData: CharacterDto[] = [
	{
		name: 'tester',
		key: 'test',
		sentiments: {
			like: 0,
			love: 0,
		},
		memories: [ 'thinking' ],
	},
	{
		name: 'tester2',
		key: 'test2',
		sentiments: {
			like: -0.5,
			love: 0.5,
		},
		memories: [ ],
	},
];