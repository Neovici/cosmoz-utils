import { assert } from '@open-wc/testing';
import { parse, round } from '../src/number';

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
});
