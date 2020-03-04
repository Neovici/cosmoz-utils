/* eslint-disable no-console */
/* eslint-env node */
const { createDefaultConfig } = require('@open-wc/testing-karma'),
	merge = require('deepmerge'),
	baseCustomLaunchers = {
		FirefoxHeadless: {
			base: 'Firefox',
			flags: ['-headless']
		}
	},
	sauceCustomLaunchers = {
		slChrome: {
			base: 'SauceLabs',
			browserName: 'chrome',
			browserVersion: 'beta',
			platformName: 'Windows 10'
		},
		slIphoneSimulator: {
			base: 'SauceLabs',
			browserName: 'Safari',
			appiumVersion: '1.15.0',
			deviceName: 'iPhone Simulator',
			deviceOrientation: 'portrait',
			platformVersion: '13.0',
			platformName: 'iOS'
		}
	},
	allCustomLaunchers = {
		...baseCustomLaunchers,
		...sauceCustomLaunchers
	};

// eslint-disable-next-line max-lines-per-function
module.exports = config => {

	const useSauce = process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY,
		customLaunchers = useSauce ? allCustomLaunchers : baseCustomLaunchers;

	if (!useSauce) {
		console.warn('Missing SAUCE_USERNAME/SAUCE_ACCESS_KEY, skipping sauce.');
	}

	config.set(
		merge(createDefaultConfig(config), {
			coverageIstanbulReporter: {
				thresholds: {
					global: {
						statements: 90,
						branches: 85,
						functions: 100,
						lines: 90
					}
				}
			},
			customLaunchers,
			browsers: Object.keys(customLaunchers),
			files: [{
				// runs all files ending with .test in the test folder,
				// can be overwritten by passing a --grep flag. examples:
				//
				// npm run test -- --grep test/foo/bar.test.js
				// npm run test -- --grep test/bar/*
				pattern: config.grep ? config.grep : 'test/**/*.test.js',
				type: 'module'
			}],

			esm: {
				nodeResolve: true,
				polyfillsLoader: {
					polyfills: {
						custom: [
							{
								name: 'plural-rules',

								test: '!window.Intl || !("PluralRules" in window.Intl)',
								path: require.resolve('@formatjs/intl-pluralrules/dist/umd/polyfill.js')
							},
							{
								name: 'plural-rules-en',

								test: '!window.Intl || !("PluralRules" in window.Intl)',
								path: require.resolve('@formatjs/intl-pluralrules/dist/locale-data/en.js')
							},
							{
								name: 'plural-rules-sv',

								test: '!window.Intl || !("PluralRules" in window.Intl)',
								path: require.resolve('@formatjs/intl-pluralrules/dist/locale-data/sv.js')
							},
							{
								name: 'relative-time-format',

								test: '!window.Intl || !("RelativeTimeFormat" in window.Intl)',
								path: require.resolve('@formatjs/intl-relativetimeformat/dist/umd/polyfill-intl-relativetimeformat.js')
							},
							{
								name: 'relative-time-format-en',

								test: '!window.Intl || !("RelativeTimeFormat" in window.Intl)',
								path: require.resolve('@formatjs/intl-relativetimeformat/dist/locale-data/en.js')
							},
							{
								name: 'relative-time-format-sv',

								test: '!window.Intl || !("RelativeTimeFormat" in window.Intl)',
								path: require.resolve('@formatjs/intl-relativetimeformat/dist/locale-data/sv.js')
							}
						]
					}
				}
			},
			client: {
				mocha: {
					ui: 'tdd'
				}
			},
			sauceLabs: {
				testName: 'cosmoz-utils karma tests'
			},
			reporters: ['dots', 'saucelabs'],
			singleRun: true
			// you can overwrite/extend the config further
		})
	);
	return config;
};
