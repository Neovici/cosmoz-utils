import { assert } from '@open-wc/testing';

import {
	prop,
	strProp
} from '../lib/object';
import { identity } from '../lib/function';

suite('prop', () => {
	test('prop', () => {
		assert.equal(prop('b')({ b: 2 }), 2);
		assert.isUndefined(prop('b')({ c: 4 }));
		assert.equal(prop(''), identity);
	});

	test('strProp', () => {
		assert.equal(strProp('b')({ b: 2 }), '2');
		assert.equal(strProp('b')({ c: 4 }), '');
	});
});

