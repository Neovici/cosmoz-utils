import { useNotifyProperty } from '../lib/hooks/use-notify-property.js';
import { component } from 'haunted';
import {
	assert,
	html,
	fixture,
	oneEvent
} from '@open-wc/testing';

customElements.define(
	'use-notify-property',
	component(({ testProp }) => {
		useNotifyProperty('propName', testProp);
	})
);

suite('use-notify-property', () => {
	test('notities', async () => {
		const el = await fixture(html`<use-notify-property></use-notify-property>`);
		setTimeout(() => {
			el.testProp = 'testing';
		});

		const ev = await oneEvent(el, 'prop-name-changed');
		assert.equal(ev.detail.value, 'testing');
		assert.equal(el.propName, 'testing');
	});
});
