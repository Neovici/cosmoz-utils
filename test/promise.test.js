import { assert, aTimeout, nextFrame } from '@open-wc/testing';
import { spy } from 'sinon';
import { debounce$, limit$ } from '../lib/promise';

suite('limit$', () => {
	test('rate limits a function', async () => {
		const callback = spy(),
			callLater = callback =>
				new Promise(resolve =>
					requestAnimationFrame(() => resolve(callback()))
				),
			callLater$ = limit$(callLater, 2);

		callLater$(callback);
		callLater$(callback);
		callLater$(callback);
		callLater$(callback);
		callLater$(callback);
		callLater$(callback);

		assert.equal(callback.callCount, 0);
		await nextFrame();
		assert.equal(callback.callCount, 2);
		await nextFrame();
		assert.equal(callback.callCount, 4);
		await nextFrame();
		assert.equal(callback.callCount, 6);
	});

	test('is transparent to success', async () => {
		const pow = x =>
				new Promise(resolve => queueMicrotask(() => resolve(x * x))),
			pow$ = limit$(pow, 3);

		assert.equal(await pow$(2), 4);
	});

	test('is transparent to error', async () => {
		const broken = () =>
				new Promise((resolve, reject) =>
					queueMicrotask(() => reject(new Error('broken')))
				),
			broken$ = limit$(broken, 3);

		try {
			await broken$();
			assert.fail('should not get to this line');
		} catch (e) {
			assert.equal(e.message, 'broken');
		}
	});

	test('also works with sync functions', async () => {
		const double = a => a * 2,
			double$ = limit$(double, 2);
		assert.equal(await double$(2), 4);
	});
});

suite('debounce$', () => {
	test('debounces an async function', async () => {
		const callLater = callback =>
				new Promise(resolve =>
					requestAnimationFrame(() => resolve(callback()))
				),
			callLater$ = debounce$(callLater, 50),
			callback = spy();

		callLater$(callback);

		await nextFrame();
		assert.isFalse(callback.called);

		callLater$(callback);

		await nextFrame();
		assert.isFalse(callback.called);

		await aTimeout(50);
		assert.isTrue(callback.called);
	});

	test('all debounced calls resolve with the same data', async () => {
		const fetch = x =>
				new Promise(resolve => requestAnimationFrame(() => resolve(x * 2))),
			fetch$ = debounce$(fetch, 50),
			result1 = fetch$(1);

		await nextFrame();

		const result2 = fetch$(2);

		await nextFrame();

		const result3 = fetch$(3);

		assert.deepEqual(await Promise.all([result1, result2, result3]), [6, 6, 6]);
	});
});
