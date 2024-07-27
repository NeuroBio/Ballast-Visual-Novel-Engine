import { Engine } from '../../../src/Engine/Engine';
import { VNEngine } from '../../../src/Engine/VNEngine';

describe(`VNEngine, get non-engine, create new engine, then re-get existing engine`, () => {
	let engine: Engine;
	describe(`getting engine when there is none`, () => {
		it(`returns nothing`, () => {
			expect(VNEngine.getLastEngine()).toEqual(undefined);
		});
	});
	describe(`given valid params`, () => {
		it(`returns a new engine`, () => {
			const params = {
				findChapterData: () => Promise.resolve([]),
				findSceneData: () => Promise.resolve([]),
				findCharacterData: () => Promise.resolve([]),
				findSavedData: () => Promise.resolve(),
				saveSavedData: () => Promise.resolve(),
			};
			engine = VNEngine.create(params);
			expect(engine instanceof Engine).toBe(true);
		});
	});
	describe(`getting engine when there is none`, () => {
		it(`returns nothing`, () => {
			expect(VNEngine.getLastEngine()).toEqual(engine);
		});
	});
});