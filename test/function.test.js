import { assert } from '@open-wc/testing';

import {
	identity,
	or
} from '../lib/function';


const obj = {};

suite('function', () => {
	test('identity', () => {
		assert.equal(identity(obj), obj);
		assert.isUndefined(identity());
	});

	test('or', () => {
		assert.equal(or(() => false, () => true)(), true);
		assert.equal(or(() => {}, () => obj)(), obj); /* eslint-disable-line no-empty-function */
	});
});
