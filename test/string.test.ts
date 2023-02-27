import { assert } from '@open-wc/testing';
import { capitalize, lcfirst } from '../src/string';

suite('string', () => {
	test('capitalize words', async () => {
		assert.equal(capitalize('aaa b    ccc'), 'Aaa B Ccc');
	});
	test('lcfirst', async () => {
		assert.equal(lcfirst('Qqq'), 'qqq');
	});
});
