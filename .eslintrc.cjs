module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
	},
	plugins: [
    	'import',
		'compat'
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:compat/recommended'
		// 'airbnb-base',
		// 'airbnb-typescript/base'
	],
	rules: {

	}
};
