import { component } from 'haunted';
import {
	assert,
	html,
	fixture,
	nextFrame
} from '@open-wc/testing';
import { lazyUntil } from '../lib/directives/lazy-until';
import { until } from 'lit-html/directives/until';

suite('lazy-until', () => {
	customElements.define(
		'test-lazy-until',
		component(({ promise }) => ['until: ', until(promise, 'loading...'), ' ', 'lazyUntil: ', lazyUntil(promise, 'loading...')])
	);

	test('renders the fallback content', async () => {
		let resolve;
		const promise = new Promise(res => {
				resolve = res;
			}),
			component = await fixture(html`<test-lazy-until .promise=${ promise }></test-ref>`);
		assert.equal('until: loading... lazyUntil: loading...', component.shadowRoot.textContent);

		resolve('loaded');

		await nextFrame();
		assert.equal('until: loaded lazyUntil: loaded', component.shadowRoot.textContent);
	});

	test('does not fall back if promise was resolved', async () => {
		const promise = Promise.resolve('loaded'),
			component = await fixture(html`<test-lazy-until .promise=${ promise }></test-ref>`);

		await nextFrame();
		assert.equal('until: loaded lazyUntil: loaded', component.shadowRoot.textContent);

		component.promise = new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve('refreshed'))));

		assert.equal('until: loaded lazyUntil: loaded', component.shadowRoot.textContent);

		await nextFrame();
		assert.equal('until: loading... lazyUntil: loaded', component.shadowRoot.textContent);

		await nextFrame();
		assert.equal('until: refreshed lazyUntil: refreshed', component.shadowRoot.textContent);
	});
});
