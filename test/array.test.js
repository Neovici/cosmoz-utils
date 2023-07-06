import { assert } from '@open-wc/testing';

import { array, without, chunk, intersect } from '../src/array';

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
		assert.lengthOf(
			without(
				[{ id: 1 }, { id: 2 }],
				(o) => o.id
			)([{ id: 1 }, { id: 2 }, { id: 3 }]),
			1
		);
	});
	test('chunk', () => {
		assert.deepEqual(chunk([1, 2, 3, 4, 5, 6, 7, 8], 3), [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8],
		]);
	});
	test('intersect', () => {
		assert.deepEqual(intersect([[1], [1, 2], [1, 3]]), [1]);
	});
});
