import pluginJs from '@eslint/js';

// look into what we did at work to make this behave
export default [
	{
		parser: "@typescript-eslint/parser",
		plugins: [
			"@typescript-eslint"
		],
		extends: [
			"plugin:@typescript-eslint/recommended"
		],
		languageOptions: {
			globals: {
				process: true,
				console: true,
				describe: true,
				it: true,
				fit: true,
				fdescribe: true,
				xit: true,
				xdescribe: true,
				jasmine: true,
				expect: true,
				spyOn: true,
				beforeEach: true,
				afterEach: true,
				beforeAll: true,
				afterAll: true,
			},
		},
	},
	pluginJs.configs.recommended,
	
	{
		'rules': {
			'arrow-spacing': ['warn', { 'before': true, 'after': true }],
			'brace-style': ['error', '1tbs', { 'allowSingleLine': false }],
			'comma-dangle': ['error', 'always-multiline'],
			'comma-spacing': 'error',
			'comma-style': 'error',
			'curly': ['error', 'multi-line', 'consistent'],
			'dot-location': ['error', 'property'],
			'handle-callback-err': 'off',
			'indent': ['error', 'tab'],
			'keyword-spacing': 'error',
			'max-nested-callbacks': ['warn', { 'max': 5 }],
			'max-statements-per-line': ['error', { 'max': 1 }],
			'no-console': 'off',
			'no-empty-function': 'error',
			'no-floating-decimal': 'error',
			'no-inline-comments': 'off',
			'no-lonely-if': 'error',
			'no-multi-spaces': 'error',
			'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 1, 'maxBOF': 0 }],
			'no-shadow': 'off',
			'no-trailing-spaces': ['error'],
			'no-var': 'error',
			'object-curly-spacing': ['error', 'always'],
			'prefer-const': 'error',
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'space-before-blocks': 'error',
			'space-before-function-paren': ['error', {
				'anonymous': 'always',
				'named': 'always',
				'asyncArrow': 'always',
			}],
			'space-in-parens': 'error',
			'space-infix-ops': 'error',
			'space-unary-ops': 'error',
			'spaced-comment': 'error',
			'yoda': 'error',
		},
	},
];