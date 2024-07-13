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
	clone = jest.fn(() => this);
	toDto = jest.fn(() => this.params);
}
