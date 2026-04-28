import { assert } from '@open-wc/testing';
import { hashUrl, multiParse, singleParse } from '../src/location';

suite('location', () => {
	const originalHash = window.location.hash;

	const setHash = (hash: string) => {
		window.location.hash = hash;
	};

	teardown(() => {
		window.location.hash = originalHash;
	});

	suite('hashUrl', () => {
		test('returns URL from hash', () => {
			setHash('#!/path#foo=bar');
			const url = hashUrl();
			assert.instanceOf(url, URL);
			assert.equal(url.pathname, '/path');
			assert.equal(url.hash, '#foo=bar');
		});

		test('handles #! prefix', () => {
			setHash('#!/test');
			const url = hashUrl();
			assert.equal(url.pathname, '/test');
		});

		test('handles %23 in hash', () => {
			setHash('#!%23anchor');
			const url = hashUrl();
			assert.equal(url.hash, '#anchor');
		});
	});

	suite('singleParse', () => {
		test('returns undefined when param not found', () => {
			setHash('#!/path');
			const result = singleParse('nonexistent');
			assert.isUndefined(result);
		});

		test('returns string for single value', () => {
			setHash('#!/path#name=value');
			const result = singleParse('name');
			assert.equal(result, 'value');
		});

		test('returns array for multiple values', () => {
			setHash('#!/path#name=value1&name=value2');
			const result = singleParse('name');
			assert.deepEqual(result, ['value1', 'value2']);
		});

		test('applies custom codec to single value', () => {
			setHash('#!/path#count=42');
			const result = singleParse('count', (v) => parseInt(v, 10));
			assert.equal(result, 42);
		});

		test('applies custom codec to multiple values', () => {
			setHash('#!/path#count=1&count=2&count=3');
			const result = singleParse('count', (v) => parseInt(v, 10));
			assert.deepEqual(result, [1, 2, 3]);
		});

		test('preserves string type with default codec', () => {
			setHash('#!/path#name=test');
			const result: string | string[] | undefined = singleParse('name');
			assert.equal(result, 'test');
		});

		test('works with hash params (not query string)', () => {
			setHash('##foo=bar&baz=qux');
			const result = singleParse('foo');
			assert.equal(result, 'bar');
		});
	});

	suite('multiParse', () => {
		test('returns empty object when no params match', () => {
			setHash('#!/path');
			const result = multiParse('filter.');
			assert.deepEqual(result, {});
		});

		test('parses params with prefix', () => {
			setHash('#!/path#filter.status=active&filter.type=admin');
			const result = multiParse('filter.');
			assert.deepEqual(result, { status: 'active', type: 'admin' });
		});

		test('returns Record<string, string> with default codec', () => {
			setHash('#!/path#name=john&age=30');
			const result: Record<string, string> = multiParse('');
			assert.deepEqual(result, { name: 'john', age: '30' });
		});

		test('applies custom codec for value transformation', () => {
			setHash('#!/path#count.a=1&count.b=2');
			const result = multiParse(
				'count.',
				([key, value]) => [key, parseInt(value, 10)] as const,
			);
			assert.deepEqual(result, { a: 1, b: 2 });
		});

		test('applies custom codec with type transformation', () => {
			setHash('#!/path#flag.enabled=true&flag.visible=false');
			const result = multiParse(
				'flag.',
				([key, value]) => [key, value === 'true'] as const,
			);
			assert.deepEqual(result, { enabled: true, visible: false });
		});

		test('filters out null/undefined values', () => {
			setHash('#!/path#item.a=value&item.b=');
			const result = multiParse('item.', ([key, value]) =>
				value ? ([key, value] as const) : ([key, null] as const),
			);
			// The empty string for 'b' becomes null, filter removes it
			assert.deepEqual(result, { a: 'value' });
		});
	});
});
