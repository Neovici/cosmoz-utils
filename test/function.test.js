import { assert } from '@open-wc/testing';

import { identity, invoke, or } from '../src/function';

const obj = {};

suite('function', () => {
	test('identity', () => {
		assert.equal(identity(obj), obj);
		assert.isUndefined(identity());
	});

	test('or', () => {
		assert.equal(
			or(
				() => false,
				() => true,
			)(),
			true,
		);
		assert.equal(
			or(
				/* eslint-disable-next-line no-empty-function */
				() => {},
				() => obj,
			)(),
			obj,
		);
	});
	test('invoke', () => {
		assert.equal(invoke(2, 3), 2);
		assert.equal(
			invoke((a, b) => b, 4, 1),
			1,
		);
	});
	test('invoke with the item-taking label union', () => {
		const labels = (item) => item.label;
		assert.equal(invoke(labels, { label: 'One' }), 'One');
		assert.equal(invoke('fallback', { label: 'One' }), 'fallback');
	});
});
