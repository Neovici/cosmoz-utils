import { assert } from '@open-wc/testing';
import { parse, round, patternInteger } from '../src/number';

suite('number', () => {
	test('parse', () => {
		assert.isUndefined(parse('adasdad'));
		assert.isUndefined(parse(Infinity));
		assert.equal(parse('12,3'), 12.3);
		assert.equal(parse('13.1'), 13.1);
		assert.equal(parse(13.2), 13.2);
	});
	test('round', () => {
		assert.equal(round(12.3158), 12.32);
	});
	test('patternInteger', () => {
		assert.isTrue(patternInteger.test('120'));
		assert.isTrue(patternInteger.test('1'));
		assert.isFalse(patternInteger.test(''));
		assert.isFalse(patternInteger.test('-120'));
	});
});
