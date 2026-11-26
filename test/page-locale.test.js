import { assert } from '@open-wc/testing';
import { timeago } from '../src/date';
import { renderAmount, renderNumberAmount } from '../src/money';

suite('page locale', () => {
	const money = { amount: 768.96, currency: 'SEK' };

	setup(() => {
		document.documentElement.lang = 'sv';
	});

	teardown(() => {
		document.documentElement.removeAttribute('lang');
	});

	test('timeago defaults to the page language', () => {
		const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
		assert.equal(timeago(dayAgo), 'i går');
		assert.equal(timeago(dayAgo, 'en'), 'yesterday');
	});

	test('renderAmount and renderNumberAmount default to the page language', () => {
		assert.equal(
			renderNumberAmount(money),
			(768.96).toLocaleString('sv', { minimumFractionDigits: 2 }),
		);
		assert.equal(
			renderAmount(money),
			new Intl.NumberFormat('sv', {
				style: 'currency',
				currency: 'SEK',
				currencyDisplay: 'code',
			}).format(768.96),
		);
	});
});
