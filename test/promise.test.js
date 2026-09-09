import { assert, aTimeout, nextFrame } from '@open-wc/testing';
import { spy } from 'sinon';
import {
	debounce$,
	limit$,
	ManagedPromise,
	retry$,
	share$,
} from '../src/promise';

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

	test('only last debounced call resolves', async () => {
		const fetch = (x) =>
				new Promise((resolve) => requestAnimationFrame(() => resolve(x * 2))),
			fetch$ = debounce$(fetch, 50);

		fetch$(1);
		await nextFrame();
		fetch$(2);
		await nextFrame();

		const result3 = fetch$(3);

		assert.equal(await result3, 6);
	});

	test('superseded debounced calls do not settle', async () => {
		const fetch = (x) =>
				new Promise((resolve) => requestAnimationFrame(() => resolve(x * 2))),
			fetch$ = debounce$(fetch, 50);

		const result1 = fetch$(1);
		await nextFrame();
		fetch$(2);
		await nextFrame();
		fetch$(3);

		let settled = false;
		result1.then(() => {
			settled = true;
		});

		await aTimeout(100);
		assert.isFalse(settled, 'superseded promise should not settle');
	});

	test('only last call rejects on error', async () => {
		const fail = () => Promise.reject(new Error('fail')),
			fail$ = debounce$(fail, 50);

		fail$(1);
		await nextFrame();
		fail$(2);
		await nextFrame();
		const result3 = fail$(3);

		try {
			await result3;
			assert.fail('should have rejected');
		} catch (e) {
			assert.equal(e.message, 'fail');
		}
	});
});

suite('share$', () => {
	test('resolves all pending callers with the same result', async () => {
		const fetch = (x) =>
				new Promise((resolve) => requestAnimationFrame(() => resolve(x * 2))),
			fetch$ = share$(fetch);

		const results = await Promise.all([fetch$(1), fetch$(2), fetch$(3)]);
		assert.deepEqual(results, [2, 2, 2]);
	});

	test('invokes the inner function once per call', async () => {
		const fetch = spy(
				(x) =>
					new Promise((resolve) => requestAnimationFrame(() => resolve(x * 2))),
			),
			fetch$ = share$(debounce$(fetch, 50));

		const p1 = fetch$(1);
		await nextFrame();
		const p2 = fetch$(1);
		await nextFrame();
		const p3 = fetch$(1);

		assert.equal(fetch.callCount, 0);

		await Promise.all([p1, p2, p3]);

		assert.equal(fetch.callCount, 1);
	});

	test('is transparent to error', async () => {
		const fail = () => Promise.reject(new Error('fail')),
			fail$ = share$(fail);

		try {
			await fail$();
			assert.fail('should have rejected');
		} catch (e) {
			assert.equal(e.message, 'fail');
		}
	});

	test('only rejects the last pending caller on error', async () => {
		const fail = () => Promise.reject(new Error('fail')),
			fail$ = share$(debounce$(fail, 50));

		const p1 = fail$(1);
		await nextFrame();
		const p2 = fail$(1);
		await nextFrame();
		const p3 = fail$(1);

		let settled1 = false;
		let settled2 = false;
		p1.then(() => {
			settled1 = true;
		});
		p2.then(() => {
			settled2 = true;
		});

		try {
			await p3;
			assert.fail('should have rejected');
		} catch (e) {
			assert.equal(e.message, 'fail');
		}

		await aTimeout(100);
		assert.isFalse(settled1, 'earlier pending caller should not settle');
		assert.isFalse(settled2, 'earlier pending caller should not settle');
	});

	test('starts a new invocation after settling', async () => {
		const fetch = spy(
				(x) =>
					new Promise((resolve) => requestAnimationFrame(() => resolve(x * 2))),
			),
			fetch$ = share$(fetch);

		assert.equal(await fetch$(1), 2);
		assert.equal(await fetch$(2), 4);
		assert.equal(fetch.callCount, 2);
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
