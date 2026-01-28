import cfg from '@neovici/cfg/eslint/index.mjs';

export default [
	...cfg,
	{
		files: ['test/**/*.js', 'test/**/*.ts'],
		rules: {
			'mocha/max-top-level-suites': 'off',
			'mocha/no-top-level-hooks': 'off',
			'mocha/no-setup-in-describe': 'off',
			'mocha/consistent-spacing-between-blocks': 'off',
			'mocha/no-identical-title': 'warn',
		},
	},
	{ ignores: ['coverage/**', 'dist/**'] },
];
