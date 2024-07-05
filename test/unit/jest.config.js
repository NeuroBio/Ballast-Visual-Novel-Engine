module.exports = {
	testTimeout: 1000 * 10,
	testMatch: ['**/test/unit/spec/**/*.spec.js', '**/test/unit/spec/**/*.spec.ts'],
	moduleDirectories: ['node_modules'],
	moduleFileExtensions: ['js', 'ts'],
	preset: 'ts-jest',
	testEnvironment: 'node',
	// transform: {
	// 	'^.+\\.js$': './babelTransformer',
	// 	'node_modules/variables/.+\\.(j|t)sx?$': 'jest-ts',
	// },
	verbose: false,
};