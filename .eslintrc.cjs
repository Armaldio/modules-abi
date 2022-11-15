module.exports = {
	root: true,
	env: {
		"browser": true,
		"amd": true,
		"node": true
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
	},
	plugins: [
    	'import',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		// 'airbnb-base',
		// 'airbnb-typescript/base'
	],
	rules: {

	}
};
