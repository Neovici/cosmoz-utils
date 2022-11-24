import { assert } from '@open-wc/testing';

import { identity, or, invoke } from '../src/function';

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
				() => true
			)(),
			true
		);
		assert.equal(
			or(
				/* eslint-disable-next-line no-empty-function */
				() => {},
				() => obj
			)(),
			obj
		);
	});
	test('invoke', () => {
		assert.equal(invoke(2, 3), 2);
		assert.equal(
			invoke((a, b) => b, 4, 1),
			1
		);
	});
});
