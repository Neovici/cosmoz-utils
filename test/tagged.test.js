import { assert } from '@open-wc/testing';
import { tagged } from '../src/tagged';

suite('tagged', () => {
	test('interpolates strings', async () => {
		assert.equal(tagged`a${2}b${3}`, 'a2b3');
	});
});
