import { component } from '@pionjs/pion';
import { assert, html, fixture } from '@open-wc/testing';
import { live } from '../src/directives/live';
import { perform } from '@neovici/cfg/web/perform';

customElements.define(
	'test-live',
	component(
		({ value, equalFn, onInput }) =>
			html`<input
				type="number"
				.value=${live(value, equalFn)}
				@input=${onInput}
			/>`,
	),
);

const correctTheDecimal = () =>
	perform(async ({ page }) => {
		await page.locator('input').press('Backspace');
		await page.locator('input').press('2');
	});

suite('live', () => {
	let el, input;
	setup(async () => {
		el = await fixture(
			html`<test-live
				.value=${1.5}
				.onInput=${(ev) => (el.value = parseFloat(ev.target.value))}
			/>`,
		);
		input = el.shadowRoot.querySelector('input');
	});

	test('original live behavior', async () => {
		await correctTheDecimal(input);
		assert.oneOf(input.value, ['21' /* chrome */, '12' /* firefox */]);
	});

	test('live custom equality', async () => {
		el.equalFn = (value, elementValue) => String(value) === elementValue;
		await correctTheDecimal(input);
		assert.equal(input.value, '1.2');
	});
});
