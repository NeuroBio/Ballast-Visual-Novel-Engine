import { SceneData } from '../../test/unit/FakeData/TestData';
import { Scene } from './Scene';


export class SceneFinder {
	byKey (sceneKey: string): Scene {
		const data = SceneData.find((x) => (x.key === sceneKey));
		return new Scene(data!);
	}
}
