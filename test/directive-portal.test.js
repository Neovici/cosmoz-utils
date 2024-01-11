import { component } from '@pionjs/pion';
import { assert, html, fixture, nextFrame } from '@open-wc/testing';
import { portal } from '../src/directives/portal';

customElements.define(
	'test-portal',
	component(({ value, target }) => {
		return html`${portal(
			html`<span class="portal-outlet">${value}</span>`,
			target,
		)}`;
	}),
);

suite('portal', () => {
	test('renders in body', async () => {
		const component = await fixture(html`<test-portal .value=${1} />`);

		assert.equal(
			document.querySelector('body > .portal-outlet').textContent,
			1,
		);

		component.value = 2;
		await nextFrame(); // it takes one frame for the content to be updated

		assert.equal(
			document.querySelector('body > .portal-outlet').textContent,
			2,
		);
	});

	test('cleans up when removed', async () => {
		const component = await fixture(html`<test-portal .value=${1} />`);
		assert.equal(
			document.querySelector('body > .portal-outlet').textContent,
			1,
		);

		component.parentNode.removeChild(component);

		assert.isNull(document.querySelector('body > .portal-outlet'));
	});

	test('renders in other element', async () => {
		const target = await fixture(html`<span></span>`),
			component = await fixture(
				html`<test-portal .value=${1} .target="${target}" />`,
			);

		assert.equal(target.querySelector('.portal-outlet').textContent, 1);

		component.value = 2;
		await nextFrame();

		assert.equal(target.querySelector('.portal-outlet').textContent, 2);

		component.parentNode.removeChild(component);
		assert.isNull(target.querySelector('.portal-outlet'));
	});

	test('can switch outlet element', async () => {
		const target = await fixture(html`<span></span>`),
			target2 = await fixture(html`<span></span>`),
			component = await fixture(
				html`<test-portal .value=${1} .target="${target}" />`,
			);

		assert.equal(target.querySelector('.portal-outlet').textContent, 1);
		assert.isNull(target2.querySelector('.portal-outlet'));

		component.value = 2;
		component.target = target2;
		await nextFrame();

		assert.isNull(target.querySelector('.portal-outlet'));
		assert.equal(target2.querySelector('.portal-outlet').textContent, 2);
	});
});
