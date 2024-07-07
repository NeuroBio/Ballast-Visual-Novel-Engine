import { SceneData } from '../../test/unit/FakeData/TestData';
import { Beat } from '../Beat/Beat';
import { BeatFactory } from '../Beat/BeatFactory';
import { Scene } from './Scene';


export class SceneFinder {
	byKey (sceneKey: string): Scene {
		const rawData = SceneData.find((x) => (x.key === sceneKey));
		if (!rawData) {
			throw new Error('fuck off typescript');
		}

		const beats = rawData.beats.reduce((keyed: { [key: string]: Beat}, beat) => {
			keyed[beat.key] = new BeatFactory().fromDto(beat);
			return keyed;
		}, {});
		return new Scene({ ...rawData, beats });
	}
}
