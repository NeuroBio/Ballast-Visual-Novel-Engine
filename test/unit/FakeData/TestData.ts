import { BeatDto, SingleConditionType } from '../../../src/Beat/BeatFactory';
import { ChapterDto } from '../../../src/Chapter/ChapterFinder';
import { CharacterDto } from '../../../src/Character/Character';
import { CharacterTemplate } from '../../../src/Character/CharacterTemplateFinder';
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
		defaultBehavior: {
			text: 'This is the opening beat.',
			nextBeat: 'secondBeat',
		},
	},
	{
		key: 'secondBeat',
		defaultBehavior: {
			text: 'This is the second beat.',
			nextBeat: 'choiceBeat',
		},
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
		defaultBehavior: {
			text: 'This is downstream of choice 1.',
			nextBeat: 'firstFitBeat',
		},
	},
	{
		key: 'downStream2',
		defaultBehavior: {
			text: 'This is downstream of choice 2.',
			nextBeat: 'firstFitBeat',
		},
	},
	{
		key: 'downStream3',
		defaultBehavior: {
			text: 'This is downstream of choice 3.',
			nextBeat: 'firstFitBeat',
		},
	},
	{
		key: 'firstFitBeat',
		branches: [
			{
				nextBeat: 'lastBeat',
				text: 'This is branch 1',
				conditions: [{
					type: SingleConditionType.AT_LEAST_ITEM,
					item: 'you do have it',
					quantity: 1,
				}],
			},
			{
				nextBeat: 'lastBeat',
				text: 'This is branch 2',
				conditions: [{
					type: SingleConditionType.AT_MOST_ITEM,
					item: 'you don\'t have it',
					quantity: 0,
				}],
			},
		],
		defaultBehavior: {
			text: 'Default behavior for first fit.',
			nextBeat: 'lastBeat',
		},
	},
	{
		key: 'lastBeat',
		defaultBehavior: {
			text: 'This is the final beat.',
		},
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
		traits: {
			like: 0,
			love: 0,
		},
		memories: [ 'thinking' ],
	},
	{
		name: 'tester2',
		key: 'test2',
		traits: {
			like: -0.5,
			love: 0.5,
		},
		memories: [ ],
	},
];

export const CharacterTemplateData: CharacterTemplate[] = [
	{
		name: 'tester',
		key: 'test',
		traits: {
			like: 0,
			love: 0,
		},
	},
	{
		name: 'tester2',
		key: 'test2',
		traits: {
			like: -0.5,
			love: 0.5,
		},
	},
];