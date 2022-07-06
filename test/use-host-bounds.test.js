import { useHostBounds } from '../src/hooks/use-host-bounds.js';
import { component } from 'haunted';
import { assert, html, fixtureSync, nextFrame } from '@open-wc/testing';

customElements.define(
	'use-host-bounds',
	component(function () {
		// eslint-disable-next-line no-invalid-this
		this.current = useHostBounds();
	})
);

suite('use-host-bounds', () => {
	test('sizing', async () => {
		const result = await fixtureSync(
			html`<use-host-bounds
				style="width: 120px; display:block"
			></use-host-bounds>`
		);

		await nextFrame();
		await nextFrame();
		await nextFrame();

		assert.equal(Math.round(result.current.width), 120);
	});
});
