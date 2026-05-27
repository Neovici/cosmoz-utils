import { assert } from '@open-wc/testing';
import { identity } from '../src/function';
import { merge, omit, prop, props, strProp } from '../src/object';

suite('prop', () => {
	test('prop', () => {
		assert.equal(prop('b')({ b: 2 }), 2);
		assert.isUndefined(prop('b')({ c: 4 }));
		assert.equal(prop(''), identity);
	});

	test('prop passes through primitives', () => {
		assert.equal(prop('key')('hello'), 'hello');
		assert.equal(prop('key')(42), 42);
		assert.isTrue(prop('key')(true));
		assert.isNull(prop('key')(null));
		assert.isUndefined(prop('key')(undefined));
	});

	test('prop with objects unchanged', () => {
		assert.equal(prop('key')({ key: 'val' }), 'val');
		assert.isUndefined(prop('key')({ other: 1 }));
	});

	test('strProp', () => {
		assert.equal(strProp('b')({ b: 2 }), '2');
		assert.equal(strProp('b')({ c: 4 }), '');
	});

	test('strProp passes through primitives', () => {
		assert.equal(strProp('key')(42), '42');
		assert.equal(strProp('key')('hello'), 'hello');
		assert.equal(strProp('key')(null), '');
		assert.equal(strProp('key')(undefined), '');
	});
});

suite('merge', () => {
	test('merges', () => {
		assert.deepEqual(merge({ a: 1 }, { b: 2 }), {
			a: 1,
			b: 2,
		});
		assert.deepEqual(
			merge(
				{
					a: 1,
					b: 3,
				},
				{ b: 2 },
			),
			{
				a: 1,
				b: 2,
			},
		);
		assert.deepEqual(
			merge(
				{
					a: 1,
					b: 3,
				},
				{ b: 2 },
				null,
			),
			{
				a: 1,
				b: 2,
			},
		);
	});

	test('merges objects', () => {
		assert.deepEqual(merge({ a: { a1: 1 } }, { a: { a2: 2 } }), {
			a: {
				a1: 1,
				a2: 2,
			},
		});
	});

	test('merges array', () => {
		assert.deepEqual(merge({ a: [1, 2] }, { a: [3, 4] }), {
			a: [1, 2, 3, 4],
		});
	});
});

suite('props', () => {
	test('picks props', () => {
		assert.deepEqual(props(['a', 'b'])({ a: 1, b: 2, c: 3 }), { a: 1, b: 2 });
	});
	test('omit props', () => {
		assert.deepEqual(omit(['a', 'b'])({ a: 1, b: 2, c: 3 }), { c: 3 });
	});
});
