import { useNotifyProperty } from '../src/hooks/use-notify-property';
import { component } from 'haunted';
import { assert, html, fixture, oneEvent } from '@open-wc/testing';

customElements.define(
	'use-notify-property',
	component(({ testProp, deps }) => useNotifyProperty('propName', testProp, deps))
);

suite('use-notify-property', () => {
	test('notifies', async () => {
		const el = await fixture(html`<use-notify-property></use-notify-property>`);
		setTimeout(() => {
			el.testProp = 'testing';
		});

		const ev = await oneEvent(el, 'prop-name-changed');
		assert.equal(ev.detail.value, 'testing');
		assert.equal(el.propName, 'testing');
	});

	test('notifies with deps', async () => {
		const el = await fixture(html`<use-notify-property .deps=${[1]} .testProp=${'testing'}></use-notify-property>`);
		setTimeout(() => {
			el.deps = [2];
		});

		const ev = await oneEvent(el, 'prop-name-changed');
		assert.equal(ev.detail.value, 'testing');
		assert.equal(el.propName, 'testing');
	});
});
