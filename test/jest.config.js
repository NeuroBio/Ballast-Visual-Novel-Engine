module.exports = {
	testTimeout: 1000 * 10,
	rootDir: '../',
	testMatch: ['**/test/**/*.spec.ts'],
	moduleDirectories: ['<rootDir>/node_modules'],
	moduleFileExtensions: ['js', 'ts'],
	preset: 'ts-jest',
	testEnvironment: 'node',
	reporters: ['jest-standard-reporter'],
	verbose: false,
	setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
	collectCoverageFrom: [
		'<rootDir>/src/**/*.ts',
		'!<rootDir>/src/index.ts'
	],
};