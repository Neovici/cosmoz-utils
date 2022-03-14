import { assert, nextFrame } from '@open-wc/testing';
import { spy } from 'sinon';
import { limit$ } from '../lib/promise';

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
});
