export class SavedData {
	params;

	constructor (params: any = {}) {
		Object.assign(this, params);
		this.params = params;
	}

	startNewChapter = jest.fn();
	completeChapter = jest.fn();
	startNewScene = jest.fn();
	getChapterData = jest.fn(() => ({}));
	getQueuedSceneForChapter = jest.fn();
	addMissingCharacters = jest.fn();
	unlockChapter = jest.fn();
	unlockAchievement = jest.fn();
	updateCharacterTrait = jest.fn();
	addMemoryToCharacter = jest.fn();
	removeMemoryFromCharacter = jest.fn();
	addInventoryItem = jest.fn();
	removeInventoryItem = jest.fn();
	queueScene = jest.fn();
	clone = jest.fn(() => this);
	toDto = jest.fn(() => this.params);
}
