import { assert, fixture, nextFrame } from '@open-wc/testing';
import { component, html } from '@pionjs/pion';
import { spy } from 'sinon';
import { overflow, overflowStyle } from '../src/directives/overflow';

const settled = async () => {
	await nextFrame();
	await new Promise((r) => setTimeout(r, 80));
};

const last = (element) =>
	element.onOverflow.getCall(element.onOverflow.callCount - 1).args[0];

customElements.define(
	'test-overflow',
	component(
		({ onOverflow }) => {
			return html`
				<style>
					/* the fixture host needs a real box with a width for the
				   band to have shrink pressure */
					:host {
						display: block;
					}

					slot[name='track'] {
						max-height: 27px;
					}

					::slotted(span) {
						box-sizing: border-box;
						display: inline-block;
						flex: none;
						width: 50px;
						height: 27px;
					}
				</style>
				<slot
					name="track"
					class="cz-overflow-band"
					${overflow({ onOverflow })}
				></slot>
			`;
		},
		{ styleSheets: [overflowStyle] },
	),
);

const chips = () =>
	fixture(
		html`<test-overflow style="width: 130px" .onOverflow=${spy()}>
			<span slot="track">one</span>
			<span slot="track">two</span>
			<span slot="track">three</span>
		</test-overflow>`,
	);

suite('overflow', () => {
	test('marks members wrapped below the one-row band', async () => {
		const element = await chips();
		await settled();
		const spans = element.querySelectorAll('span[slot]');
		assert.sameDeepMembers([...last(element)], [spans[2]]);
		assert.isFalse(spans[0].hasAttribute('overflowing'));
		assert.isFalse(spans[1].hasAttribute('overflowing'));
		assert.isTrue(spans[2].hasAttribute('overflowing'));
	});

	test('a row-1 member taller than the band is not marked', async () => {
		// content 1px over the band's height (a badge'd member) stays in
		// the band: only a wrapped row reports zero intersection
		const element = await fixture(
			html`<test-overflow style="width: 130px" .onOverflow=${spy()}>
				<span slot="track">one</span>
				<span slot="track" style="height: 28px">two</span>
				<span slot="track">three</span>
			</test-overflow>`,
		);
		await settled();
		const spans = element.querySelectorAll('span[slot]');
		assert.sameDeepMembers([...last(element)], [spans[2]]);
		assert.isFalse(spans[1].hasAttribute('overflowing'));
	});

	test('reports a member flowing back inside the band', async () => {
		const element = await chips();
		await settled();
		const calls = element.onOverflow.callCount;

		element.style.width = '300px';
		await settled();
		assert.equal(element.onOverflow.callCount, calls + 1);
		assert.equal(element.onOverflow.getCall(calls).args[0].size, 0);
		assert.isFalse(
			element.querySelectorAll('span[slot]')[2].hasAttribute('overflowing'),
		);
	});

	test('drops departed members', async () => {
		const element = await chips();
		await settled();
		const spans = element.querySelectorAll('span[slot]');
		const calls = element.onOverflow.callCount;
		assert.isTrue(spans[2].hasAttribute('overflowing'));

		spans[2].remove();
		await settled();
		assert.equal(element.onOverflow.callCount, calls + 1);
		assert.equal(element.onOverflow.getCall(calls).args[0].size, 0);
	});
});
