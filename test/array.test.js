import { assert } from '@open-wc/testing';

import {
	array,
	without
} from '../src/array';


const empty = [],
	obj = {};

suite('array', () => {
	test('array', () => {
		assert.equal(array(empty), empty);
		assert.equal(array(obj)[0], obj);
		assert.lengthOf(array(), 0);
		assert.lengthOf(array(null), 0);

		assert(array('asd')[0], 'asd');

		const nodeList = document.querySelectorAll('*');
		assert.lengthOf(array(nodeList), nodeList.length);
		assert.isTrue(Array.isArray(array(nodeList)));
	});
	test('without', () => {
		assert.lengthOf(without(obj)(obj), 0);
		assert.lengthOf(without([1])([obj, 1]), 1);
		assert.lengthOf(without([{ id: 1 }, { id: 2 }], o => o.id)([{ id: 1 }, { id: 2 }, { id: 3 }]), 1);
	});
});
