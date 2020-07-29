import { assert } from '@open-wc/testing';

import {
	array,
	without
} from '../lib/array';


const empty = [],
	obj = {};

suite('array', () => {
	test('array', () => {
		assert.equal(array(empty), empty);
		assert.equal(array(obj)[0], obj);
		assert.lengthOf(array(), 0);
	});
	test('without', () => {
		assert.lengthOf(without(obj)(obj), 0);
		assert.lengthOf(without([1])([obj, 1]), 1);
	});
});
