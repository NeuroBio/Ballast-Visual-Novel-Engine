import { FinalBeat, SimpleBeat } from './Beat';
import { BeatFactory } from './BeatFactory';
import { Chapter } from './Chapter';
import { ChapterFinder } from './ChapterFinder';
import { CharacterTemplateFinder } from './CharacterTemplateFinder';
import { SavedData } from './SavedData';
import { SavedDataRepo } from './SavedDataRepo';
import { Scene } from './Scene';
import { SceneFinder } from './SceneFinder';

export const Fakes = {
	CharacterTemplateFinder,
	Chapter,
	ChapterFinder,
	SceneFinder,
	Scene,
	SimpleBeat,
	FinalBeat,
	BeatFactory,
	SavedDataRepo,
	SavedData,
};
