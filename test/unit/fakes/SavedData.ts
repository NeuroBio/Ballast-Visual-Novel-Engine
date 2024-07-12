export class SavedData {
	params;

	constructor (params: any = {}) {
		Object.assign(this, params);
		this.params = params;
	}

	startNewChapter = jest.fn();
	completeChapter = jest.fn();
	startNewScene = jest.fn();
	getChapterData = jest.fn().mockResolvedValue({});
	clone = jest.fn().mockImplementation(() => new SavedData(this.params));
	toDto = jest.fn().mockImplementation(() => this.params);
}
