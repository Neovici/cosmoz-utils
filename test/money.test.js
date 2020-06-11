import {
	assert
} from '@open-wc/testing';
import {
	amountEquals, isAmount, renderAmount, renderNumberAmount, renderMoney
} from '../lib/money';

suite('money utils', () => {
	const amount = 2200200.3333333333,
		testCurrencies = [
			'EUR',
			'NOK',
			'SEK',
			'USD'
		],
		localizedOutputs = {
			'en-US': {
				2200200.3333333333: {
					USD: ['USD 2,200,200.33'],
					EUR: ['EUR 2,200,200.33'],
					SEK: ['SEK 2,200,200.33', 'SEK2,200,200.33'],
					NOK: ['NOK 2,200,200.33', 'NOK2,200,200.33'],
					number: '2,200,200.33'
				}
			},
			'sv-SE': {
				2200200.3333333333: {
					USD: ['2 200 200,33 USD'],
					EUR: ['2 200 200,33 EUR'],
					SEK: ['2 200 200,33 SEK'],
					NOK: ['2 200 200,33 NOK'],
					number: '2 200 200,33'
				}
			}
		};

	test('amountEquals ', () => {
		assert.equal(amountEquals(null, null), false);
		assert.equal(amountEquals(null, false), false);
		assert.equal(amountEquals(100, 100), false);
		assert.equal(amountEquals({ amount }, { amount }), false);

		assert.equal(amountEquals({ amount }, {
			amount,
			currency: 'USD'
		}), false);

		assert.equal(amountEquals({
			amount: null,
			currency: 'USD'
		}, {
			amount: null,
			currency: 'USD'
		}), false);

		assert.equal(amountEquals({
			amount,
			currency: null
		}, {
			amount,
			currency: null
		}), false);

		assert.equal(amountEquals({
			amount,
			currency: 'SEK'
		}, { amount }), false);

		assert.equal(amountEquals({
			amount,
			currency: 'EUR'
		}, {
			amount: -amount,
			currency: 'EUR'
		}), false);

		assert.equal(amountEquals({
			amount,
			currency: 'EUR'
		}, {
			amount,
			currency: 'EUR'
		}), true);

		assert.equal(amountEquals({
			amount: 1.01,
			currency: 'EUR'
		}, {
			amount: 1.009,
			currency: 'EUR'
		}, 2), true);

		assert.equal(amountEquals({
			amount: 1.01,
			currency: 'EUR'
		}, {
			amount: 1.009,
			currency: 'EUR'
		}, 3), false);

		assert.equal(amountEquals({
			amount: 1.100,
			currency: 'EUR'
		}, {
			amount: 1.1001,
			currency: 'EUR'
		}, 2), true);

		assert.equal(amountEquals({
			amount: -1.1001,
			currency: 'EUR'
		}, {
			amount: -1.100,
			currency: 'EUR'
		}, 2), true);

		assert.equal(amountEquals({
			amount,
			currency: 'EUR'
		}, {
			amount,
			currency: 'EUR'
		}, 4), true);
	});

	test('isAmount ', () => {
		assert.equal(isAmount(null), false);
		assert.equal(isAmount(false), false);
		assert.equal(isAmount(100), false);
		assert.equal(isAmount({ amount }), false);
		assert.equal(isAmount({ currency: 'EUR' }), false);

		assert.equal(isAmount({
			amount,
			currency: 'EUR'
		}), true);

		assert.equal(isAmount({
			amount: amount.toString(),
			currency: 'EUR'
		}), false);

		assert.equal(isAmount({
			amount: null,
			currency: 'USD'
		}), false);

		assert.equal(isAmount({
			amount,
			currency: null
		}), false);
	});

	test('renderAmount ', () => {
		assert.equal(renderAmount(null), undefined);
		assert.equal(renderAmount(), undefined);

		assert.isString(renderAmount({
			amount: 100,
			currency: 'USD'
		}));

		assert.isAtLeast(renderAmount({
			amount: 100,
			currency: 'USD'
		}).length, 4);
	});

	Object.entries(localizedOutputs).forEach(([locale, localizedOutput]) => {
		test('renderAmount with locale ' + locale, () => {
			assert.equal(renderAmount({ amount }, locale), undefined);

			assert.equal(
				renderAmount({
					amount,
					currency: 'USD'
				}, locale),
				renderMoney({
					amount,
					currency: 'USD'
				}, locale)
			);
		});


		testCurrencies.forEach(currency => {
			test(`renderAmount with locale ${ locale } and currency ${ currency }`, () => {
				assert.oneOf(
					renderAmount(
						{
							amount,
							currency
						},
						locale
					),
					localizedOutput[amount][currency]
				);
			});
		});

		test('renderNumberAmount ', () => {
			assert.equal(renderNumberAmount({
				amount,
				currency: 'USD'
			}, locale), localizedOutput[amount].number);
		});
	});

	test('renderNumberAmount ', () => {
		assert.isString(renderNumberAmount({
			amount: 100,
			currency: 'USD'
		}));
		assert.isAtLeast(renderNumberAmount({
			amount: 100,
			currency: 'USD'
		}).length, 3);
	});
});
