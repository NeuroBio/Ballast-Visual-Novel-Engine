import { BeatDto } from '../../../src/Beat/BeatFactory';
import { ChapterDto } from '../../../src/Chapter/ChapterFinder';
import { SceneDto } from '../../../src/Scene/SceneFinder';

export const ChapterData: ChapterDto[] = [
	{
		key: 'firstChapter',
		name: 'Chapter Name',
		locked: false,
		firstSceneKey: 'sceneKey',
		scenes: ['sceneKey'],
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
];

