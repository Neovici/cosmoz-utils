import {
	assert
} from '@open-wc/testing';
import {
	anyTrue, concat, ifElse, inArray, isEqual, isEmpty, toFixed
} from '../src/template';

suite('template utils', () => {
	test('anyTrue', () => {
		assert.isFalse(anyTrue(0, null, false), false);
		assert.isTrue(anyTrue(1, null, false), true);
		assert.isTrue(anyTrue(0, null, true), true);
	});

	test('concat', () => {
		assert.equal(concat('1', '2', '3'), '123');
		assert.equal(concat('a', 'b', 'c'), 'abc');
	});

	test('ifElse', () => {
		const vif = new Object(),
			velse = new Object();
		assert.equal(ifElse(true, vif, velse), vif);
		assert.equal(ifElse(false, vif, velse), velse);
	});

	test('inArray', () => {
		const obj = new Object(),
			array = [1, 2, obj];
		assert.isTrue(inArray(obj, array));
		assert.isFalse(inArray(new Object(), array));
	});

	test('isEqual', () => {
		assert.isTrue(isEqual('123', '123'));
		assert.isFalse(isEqual(0, true));
	});

	test('isEmpty', () => {
		assert.isTrue(isEmpty(null));
		assert.isTrue(isEmpty(undefined));
		assert.isTrue(isEmpty([]));
		assert.isTrue(isEmpty(''));
		assert.isTrue(isEmpty(0));
		assert.isTrue(isEmpty());
	});

	test('toFixed', () => {
		assert.equal(toFixed(1.124123123, 2), '1.12');
		assert.equal(toFixed(33.13941313, 0), '33');
		assert.equal(toFixed('notnumber', 0), '');
	});
});
