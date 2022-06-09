import { component } from 'haunted';
import { assert, html, fixture, nextFrame } from '@open-wc/testing';
import { spreadProps } from '../lib/directives/spread-props';

customElements.define(
	'test-spread-props',
	component(({ props }) => html`<div ${spreadProps(props)}></div>`)
);

suite('spreadProps', () => {
	test('spreads props correctly', async () => {
		const el = await fixture(
			html`<test-spread-props .props=${{ a: 1, b: 2 }} />`
		);
		await nextFrame();

		const del = el.shadowRoot.querySelector('div');
		assert.equal(del.a, 1);
		assert.equal(del.b, 2);

		el.props = { c: 3 };
		await nextFrame();

		assert.equal(del.a, undefined);
		assert.equal(del.b, undefined);
		assert.equal(del.c, 3);
	});
});
