import { component } from 'haunted';
import { assert, html, fixture, nextFrame } from '@open-wc/testing';
import { measure } from '../src/directives/measure';
import { spy, match } from 'sinon';

const select = (el) => el.querySelectorAll('span'),
	selectFirst = (el) => el.querySelectorAll('span:first-child');

customElements.define(
	'test-measure',
	component(({ select, onMeasure }) => {
		return html`
			<style>
				:host {
					display: block;
				}

				div {
					width: 100%;
					display: flex;
				}

				span {
					flex: 1;
				}
			</style>
			<div ${measure(select, onMeasure)}>
				<span>Text1</span><span>Text2</span><span>Text3</span>
			</div>
		`;
	})
);

suite('measure', () => {
	test('collects initial measurements accurately', async () => {
		const onMeasure = spy();
		await fixture(
			html`<test-measure
				style="width: 300px"
				.select=${select}
				.onMeasure=${onMeasure}
			/>`
		);
		await nextFrame();
		assert.isTrue(onMeasure.calledOnce);
		assert.isTrue(onMeasure.calledWith(match.every(match({ width: 100 }))));
	});

	test('reports resizes accurately', async () => {
		const onMeasure = spy(),
			element = await fixture(
				html`<test-measure
					style="width: 300px"
					.select=${select}
					.onMeasure=${onMeasure}
				/>`
			);

		await nextFrame();

		element.style.setProperty('width', '150px');
		await nextFrame();

		assert.isTrue(onMeasure.calledTwice);
		assert.isTrue(onMeasure.calledWith(match.every(match({ width: 50 }))));
	});

	test('can change selection function', async () => {
		const onMeasure = spy(),
			element = await fixture(
				html`<test-measure
					style="width: 300px"
					.select=${select}
					.onMeasure=${onMeasure}
				/>`
			);
		await nextFrame();

		element.select = selectFirst;
		await nextFrame(); // one frame for lit commit
		await nextFrame(); // one frame for resize observer to be set up

		assert.isTrue(onMeasure.calledTwice);
		assert.isTrue(onMeasure.calledWith(match.every(match({ width: 100 }))));
		assert.lengthOf(onMeasure.secondCall.firstArg, 1);
	});

	test('does not call measure callback multiple times if the selection function remains the same', async () => {
		const onMeasure = spy(),
			element = await fixture(
				html`<test-measure
					style="width: 300px"
					.select=${select}
					.onMeasure=${onMeasure}
				/>`
			);
		await nextFrame();

		element.select = select;
		await nextFrame(); // one frame for lit commit
		await nextFrame(); // one frame for resize observer to be set up

		assert.isTrue(onMeasure.calledOnce);
	});
});
