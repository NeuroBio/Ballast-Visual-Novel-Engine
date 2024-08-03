global.console = {
	...console,
	debug: jest.fn(),
	warn: jest.fn(),
};