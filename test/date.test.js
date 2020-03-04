import {
	assert
} from '@open-wc/testing';
import {
	ensureDate, isoDate, isoDT, pastDate, renderDate, timeago, toLocalISOString, pad
} from '../lib/date';

suite('date utils', () => {
	const date = new Date('October 13, 2014 11:13:20'),
		futureDate = new Date('October 13, 2022 11:13:20'),
		undefinedDate = undefined,
		invalidDate = '';

	test('ensureDate', () => {
		assert.equal(ensureDate(undefined), undefined);
		assert.equal(ensureDate(date), date);
		const dateObj = ensureDate('October 13, 2014 11:13:20');
		assert.equal(dateObj instanceof Date, true);
		assert.equal(ensureDate(invalidDate), undefined);
		assert.equal(ensureDate('abc'), undefined);
		assert.equal(ensureDate(null), undefined);
	});

	test('isoDate()', () => {
		assert.equal(isoDate(invalidDate), '');
		assert.equal(isoDate(undefinedDate), '');
		assert.equal(isoDate(date), '2014-10-13');
	});

	test('isoDT()', () => {
		assert.equal(isoDT(invalidDate), '');
		assert.equal(isoDT(undefinedDate), '');
		assert.equal(isoDT(date), '2014-10-13 11:13:20');
	});

	test('pastDate', () => {
		assert.isTrue(pastDate(date));
		assert.isFalse(pastDate(futureDate));
	});

	test('renderDate, renderDateTime', () => {
		assert.equal(renderDate(date), isoDate(date));
	});

	test('timeago one hour', () => {
		const dateNow = new Date(),
			dateHourAgo = new Date(dateNow.getTime() - 60 * 60 * 1000);

		assert.equal(timeago(dateHourAgo), '1 hour ago');
		assert.equal(timeago(dateHourAgo, 'sv'), 'för 1 timme sedan');
		assert.equal(timeago(null), '');
		assert.equal(timeago(undefined), '');
		assert.equal(timeago(new Date('bogus')), '');
	});

	test('toLocalISOString', () => {
		const someDate = new Date('2019-06-26T12:00:00Z'),
			tz = someDate.getTimezoneOffset() / 60;
		assert.equal(toLocalISOString(someDate), `2019-06-26T${ pad(12 - tz) }:00:00.000`);
		assert.equal(toLocalISOString('not a date'), null);
	});
});
