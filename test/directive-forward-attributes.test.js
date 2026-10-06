import { assert, fixture, html, nextFrame } from '@open-wc/testing';
import { component } from '@pionjs/pion';
import { forwardAttributes } from '../src/directives/forward-attributes';

customElements.define(
	'test-forward-attrs',
	component(
		({ attrs }) =>
			html`<slot name="button" ${forwardAttributes(attrs)}></slot>`,
	),
);

suite('forwardAttributes', () => {
	test('projects onto the assigned element', async () => {
		const el = await fixture(
			html`<test-forward-attrs .attrs=${{ 'aria-expanded': 'false' }}
				><button slot="button" class="t1">T</button></test-forward-attrs
			>`,
		);
		await nextFrame();
		const trigger = el.querySelector('.t1');
		assert.equal(trigger.getAttribute('aria-expanded'), 'false');

		el.attrs = { 'aria-expanded': 'true' };
		await nextFrame();
		assert.equal(trigger.getAttribute('aria-expanded'), 'true');

		el.attrs = { 'aria-expanded': 'false' };
		await nextFrame();
		assert.equal(trigger.getAttribute('aria-expanded'), 'false');
	});

	test('null removes, fn computes per item', async () => {
		const el = await fixture(
			html`<test-forward-attrs
				.attrs=${{
					'aria-expanded': 'true',
					tabindex: (item) => (item.hasAttribute('data-on') ? '0' : '-1'),
				}}
				><button slot="button" class="t2" data-on>T</button></test-forward-attrs
			>`,
		);
		await nextFrame();
		const trigger = el.querySelector('.t2');
		assert.equal(trigger.getAttribute('tabindex'), '0');
		assert.equal(trigger.getAttribute('aria-expanded'), 'true');

		trigger.removeAttribute('data-on');
		el.attrs = {
			'aria-expanded': 'true',
			tabindex: (item) => (item.hasAttribute('data-on') ? '0' : '-1'),
		};
		await nextFrame();
		assert.equal(trigger.getAttribute('tabindex'), '-1');

		el.attrs = { 'aria-expanded': 'true', tabindex: null };
		await nextFrame();
		assert.equal(trigger.hasAttribute('tabindex'), false);
	});

	test('no assignees writes nothing', async () => {
		const el = await fixture(
			html`<test-forward-attrs
				.attrs=${{ 'aria-expanded': 'true' }}
			></test-forward-attrs>`,
		);
		await nextFrame();
		assert.equal(el.getAttribute('aria-expanded'), null);
	});

	test('reprojects on slot change', async () => {
		const el = await fixture(
			html`<test-forward-attrs
				.attrs=${{ 'aria-expanded': 'true' }}
			></test-forward-attrs>`,
		);
		await nextFrame();
		const second = document.createElement('button');
		second.setAttribute('slot', 'button');
		second.className = 't3';
		el.appendChild(second);
		await nextFrame();
		assert.equal(el.querySelector('.t3').getAttribute('aria-expanded'), 'true');
	});

	test('disconnected stops, reconnected resumes', async () => {
		const el = await fixture(
			html`<test-forward-attrs .attrs=${{ 'aria-expanded': 'false' }}
				><button slot="button" class="t4">T</button></test-forward-attrs
			>`,
		);
		const trigger = el.querySelector('.t4');
		await nextFrame();
		assert.equal(trigger.getAttribute('aria-expanded'), 'false');

		el.remove();
		el.attrs = { 'aria-expanded': 'true' };
		await nextFrame();
		assert.equal(trigger.getAttribute('aria-expanded'), 'false');

		document.body.appendChild(el);
		await nextFrame();
		assert.equal(trigger.getAttribute('aria-expanded'), 'true');
	});
});
