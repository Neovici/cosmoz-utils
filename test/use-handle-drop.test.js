import { useHandleDrop } from '../lib/hooks/use-handle-drop';
import { component } from 'haunted';
import {
	assert,
	html,
	fixture
} from '@open-wc/testing';
import { spy } from 'sinon';

customElements.define(
	'use-handle-drop',
	component(({
		el,
		callback
	}) => {
		useHandleDrop(el, callback);
	})
);


suite('use-handle-drop', () => {
	test('drag/drop', async () => {
		const el = document.createElement('div'),
			callback = spy();
		await fixture(html`<use-handle-drop .el=${ el } .callback=${ callback } />`);
		el.dispatchEvent(new Event('dragenter'));
		el.dispatchEvent(new Event('drop'));
		assert.isTrue(callback.calledOnce);
	});
});
