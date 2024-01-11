import { useDebounceRaf } from '../src/hooks/use-debounce-raf';
import { component } from '@pionjs/pion';
import {
	assert,
	html,
	fixture,
	nextFrame
} from '@open-wc/testing';

customElements.define(
	'use-debounce-raf',
	component(function ({ value }) {
		// eslint-disable-next-line no-invalid-this
		this.current = useDebounceRaf(value);
	})
);


suite('use-debounce-raf', () => {
	test('debounced', async () => {
		const value = 1,
			result = await fixture(html`<use-debounce-raf .value=${ value } />`);
		assert.equal(result.current, value);

		result.value = 2;
		assert.equal(result.current, 1);

		// 1st frame
		await nextFrame();
		assert.equal(result.current, 1);

		//2nd frame
		await nextFrame();
		assert.equal(result.current, 1);

		//3rd frame
		await nextFrame();
		assert.equal(result.current, 2);
	});
});
