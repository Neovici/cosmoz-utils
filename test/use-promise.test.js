import { usePromise } from '../src/hooks/use-promise';
import { component } from 'haunted';
import {
	assert,
	html,
	fixture,
	nextFrame
} from '@open-wc/testing';

customElements.define(
	'use-promise',
	component(function ({ promise }) {
		// eslint-disable-next-line no-invalid-this
		this.current = usePromise(promise);
	})
);

const future = () => {
	const lifecycle = {};
	return Object.assign(
		new Promise((resolve, reject) => {
			Object.assign(lifecycle, {
				resolve,
				reject
			});
		}), {
			resolve: (...args) => lifecycle.resolve?.(...args),
			reject: (...args) => lifecycle.reject?.(...args)
		});
};


suite('use-promise', () => {
	test('missing', async () => {
		const result = await fixture(html`<use-promise  />`);
		assert.equal(result.current[2], 'pending');
	});

	test('resolve', async () => {
		const promise = future(),
			resolved = {},
			result = await fixture(html`<use-promise .promise=${ promise } />`);

		assert.isUndefined(result.current[0]);
		assert.isUndefined(result.current[1]);
		assert.equal(result.current[2], 'pending');

		promise.resolve(resolved);

		await nextFrame();
		assert.equal(result.current[0], resolved);
		assert.isUndefined(result.current[1]);
		assert.equal(result.current[2], 'resolved');
	});

	test('reject', async () => {
		const promise = future(),
			rejected = new Error('reject'),
			result = await fixture(html`<use-promise .promise=${ promise } />`);

		assert.isUndefined(result.current[0]);
		assert.isUndefined(result.current[1]);
		assert.equal(result.current[2], 'pending');

		promise.reject(rejected);

		await nextFrame();
		assert.isUndefined(result.current[0]);
		assert.equal(result.current[1], rejected);
		assert.equal(result.current[2], 'rejected');
	});
});
