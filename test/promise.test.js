import { assert, aTimeout, nextFrame } from '@open-wc/testing';
import { spy } from 'sinon';
import { debounce$, limit$, ManagedPromise, retry$ } from '../src/promise';

const nextMicrotask = () => new Promise(queueMicrotask);

suite('limit$', () => {
	test('rate limits a function', async () => {
		const callback = spy(),
			callLater = (callback) =>
				new Promise((resolve) =>
					requestAnimationFrame(() => resolve(callback())),
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
		const pow = (x) =>
				new Promise((resolve) => queueMicrotask(() => resolve(x * x))),
			pow$ = limit$(pow, 3);

		assert.equal(await pow$(2), 4);
	});

	test('is transparent to error', async () => {
		const broken = () =>
				new Promise((resolve, reject) =>
					queueMicrotask(() => reject(new Error('broken'))),
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
		const double = (a) => a * 2,
			double$ = limit$(double, 2);
		assert.equal(await double$(2), 4);
	});
});

suite('debounce$', () => {
	test('debounces an async function', async () => {
		const timeout = 50;
		const safetyMargin = 10; // Add margin of safety to prevent race conditions. See issue #206
		const callLater = (callback) =>
				new Promise((resolve) =>
					requestAnimationFrame(() => resolve(callback())),
				),
			callLater$ = debounce$(callLater, timeout),
			callback = spy();

		callLater$(callback);

		await nextFrame();
		assert.isFalse(callback.called);

		callLater$(callback);

		await nextFrame();
		assert.isFalse(callback.called);

		await aTimeout(timeout + safetyMargin);
		assert.isTrue(callback.called);
	});

	test('all debounced calls resolve with the same data', async () => {
		const fetch = (x) =>
				new Promise((resolve) => requestAnimationFrame(() => resolve(x * 2))),
			fetch$ = debounce$(fetch, 50),
			result1 = fetch$(1);

		await nextFrame();

		const result2 = fetch$(2);

		await nextFrame();

		const result3 = fetch$(3);

		assert.deepEqual(await Promise.all([result1, result2, result3]), [6, 6, 6]);
	});
});

suite('ManagedPromise', () => {
	test('can substitute a normal Promise', async () => {
		const p = new ManagedPromise((resolve) => resolve(10)),
			cb = spy();
		p.then(cb);
		await p;
		assert.isTrue(cb.called);
		assert.isTrue(cb.calledWith(10));
	});

	test('can be resolved externally', async () => {
		const p = new ManagedPromise(),
			cb = spy();
		p.then(cb);
		p.resolve();
		await nextMicrotask();
		assert.isTrue(cb.called);
	});

	test('can be rejected externally', async () => {
		const p = new ManagedPromise(),
			cb = spy();
		p.catch(cb);
		p.reject();
		await nextMicrotask();
		assert.isTrue(cb.called);
	});

	test('only resolves once', async () => {
		const p = new ManagedPromise(),
			cb = spy();
		p.then(cb);
		p.resolve();
		await nextMicrotask();
		p.resolve();
		await nextMicrotask();
		assert.isTrue(cb.called);
		assert.isTrue(cb.calledOnce);
	});
});

suite('retry$', () => {
	test('retries a function until it resolves', async () => {
		let numCalls = 0;
		const fn = retry$(() => {
			++numCalls;
			if (numCalls === 3) {
				return 'ok';
			}
			throw new Error('fail');
		}, 3);

		const result = await fn();

		assert.equal(numCalls, 3);
		assert.equal(result, 'ok');
	});

	test('retries a function until it reaches max retries', async () => {
		let numCalls = 0;
		const fn = retry$(() => {
			++numCalls;
			throw new Error('fail');
		}, 3);

		try {
			await fn();
		} catch (e) {
			assert.exists(e);
		}

		assert.equal(numCalls, 3);
	});

	test('does not retry needlesly', async () => {
		let numCalls = 0;
		const fn = retry$(() => {
			++numCalls;
			return 'ok';
		}, 3);

		const result = await fn();

		assert.equal(numCalls, 1);
		assert.equal(result, 'ok');
	});
});
