import { assert } from '@open-wc/testing';
import {
	ensureDate,
	isoDate,
	isoDT,
	pastDate,
	renderDate,
	timeago,
	toLocalISOString,
	pad,
} from '../src/date';

suite('date', () => {
	const date = new Date('October 13, 2014 11:13:20'),
		futureDate = new Date('October 13, 2026 11:13:20'),
		undefinedDate = undefined,
		invalidDate = '';

	test('ensureDate', () => {
		assert.equal(ensureDate(date), date);
		assert.isUndefined(ensureDate(undefined));
		const dateObj = ensureDate('October 13, 2014 11:13:20');
		assert.equal(dateObj instanceof Date, true);
		assert.isUndefined(ensureDate(invalidDate));
		assert.isUndefined(ensureDate('abc'));
		assert.isUndefined(ensureDate(null));
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
		assert.isUndefined(pastDate());
	});

	test('renderDate, renderDateTime', () => {
		assert.equal(renderDate(date), isoDate(date));
	});

	test('timeago', () => {
		const dateNow = new Date(),
			second = 1000,
			secondsAgo = new Date(dateNow.getTime() - 5 * second),
			minute = 60 * second,
			minutesAgo = new Date(dateNow.getTime() - 2 * minute),
			hour = 60 * minute,
			hourAgo = new Date(dateNow.getTime() - hour),
			day = 24 * hour,
			dayAgo = new Date(dateNow.getTime() - day),
			monthsAgo = (() => {
				const d = new Date();
				d.setMonth(d.getMonth() - 2);
				return d;
			})(),
			yearsAgo = (() => {
				const d = new Date();
				d.setFullYear(d.getFullYear() - 2);
				return d;
			})();

		assert.include(timeago(secondsAgo), 'seconds ago');
		assert.include(timeago(secondsAgo, 'sv'), 'sekunder sedan');

		assert.include(timeago(minutesAgo), 'minutes ago');
		assert.include(timeago(minutesAgo, 'sv'), 'minuter sedan');

		assert.equal(timeago(hourAgo), '1 hour ago');
		assert.equal(timeago(hourAgo, 'sv'), 'för 1 timme sedan');

		assert.equal(timeago(dayAgo), 'yesterday');
		assert.equal(timeago(dayAgo, 'sv'), 'i går');

		assert.include(timeago(monthsAgo), 'months ago');
		assert.include(timeago(monthsAgo, 'sv'), 'månader sedan');

		assert.include(timeago(yearsAgo), 'years ago');
		assert.include(timeago(yearsAgo, 'sv'), 'år sedan');

		assert.equal(timeago(null), '');
		assert.equal(timeago(undefined), '');
		assert.equal(timeago(new Date('bogus')), '');
	});

	test('toLocalISOString', () => {
		const someDate = new Date('2019-06-26T12:00:00Z'),
			tz = someDate.getTimezoneOffset() / 60;
		assert.equal(
			toLocalISOString(someDate),
			`2019-06-26T${pad(12 - tz)}:00:00.000`
		);
		assert.equal(toLocalISOString('not a date'), null);
	});
});
