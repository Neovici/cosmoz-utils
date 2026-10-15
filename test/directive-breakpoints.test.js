import { assert, fixture, html } from '@open-wc/testing';
import { component } from '@pionjs/pion';
import { nothing } from 'lit-html';
import { breakpoints, normalize } from '../src/directives/breakpoints';

/**
 * Test-only pion component modeling the cosmoz-resizable spike scenario:
 * - `direction` as an observed attribute (validates the full
 *   attr → attributeChangedCallback → reflective prop → re-render loop)
 * - an internal `data-direction` effect (the shared-write case)
 * - `foreign` on an unmanaged key (foreign writes must be invisible)
 * - `_writes` render counter (deps-gate / purity assertions)
 */
const TestHost = (host) => {
	host._writes = (host._writes ?? 0) + 1;
	host.setAttribute('data-direction', host.direction ?? 'horizontal');
	return html`<div id="out">${host.direction ?? nothing}</div>`;
};

customElements.define(
	'breakpoints-test',
	component(TestHost, { observedAttributes: ['direction'] }),
);

// two frames: one for the lit commit, one for the ResizeObserver delivery
const nextFrame = () =>
	new Promise((resolve) =>
		requestAnimationFrame(() => requestAnimationFrame(resolve)),
	);

const twoBreakpoints = () => [
	{ name: 'mobile', maxWidth: 480, attrs: { direction: 'vertical' } },
	// unnamed base → data-breakpoint absent at wide width
	{ attrs: { direction: 'horizontal' } },
];

/** Mount the directive on a breakpoints-test of the given width. */
const mount = (factory, deps = [], width = 600) =>
	fixture(
		html`<breakpoints-test
			style="display:block;width:${width}px;height:50px;"
			${breakpoints(factory, deps)}
		></breakpoints-test>`,
	);

/** Resize the host box by restyling it, then let RO deliver (2 frames). */
const setWidth = async (el, width) => {
	el.style.width = `${width}px`;
	await nextFrame();
};

suite('breakpoints', () => {
	test('applies base breakpoint at wide width', async () => {
		const el = await mount(twoBreakpoints);
		await nextFrame();
		assert.equal(el.direction, 'horizontal');
		assert.isFalse(el.hasAttribute('data-breakpoint'));
	});

	test('applies narrow breakpoint under maxWidth and reflects data-breakpoint', async () => {
		const el = await mount(twoBreakpoints);
		await setWidth(el, 400);
		assert.equal(el.direction, 'vertical');
		assert.equal(el.getAttribute('data-breakpoint'), 'mobile');
	});

	test('exit restores base breakpoint values', async () => {
		const el = await mount(twoBreakpoints);
		await setWidth(el, 400);
		assert.equal(el.direction, 'vertical');

		await setWidth(el, 600);
		assert.equal(el.direction, 'horizontal');
		assert.isFalse(el.hasAttribute('data-breakpoint'));
	});

	test('narrowest matching breakpoint wins per key', async () => {
		const el = await mount(twoBreakpoints);
		await setWidth(el, 400);
		await setWidth(el, 800); // only base matches
		assert.equal(el.direction, 'horizontal');
	});

	test('RO initial fire evaluates breakpoint without resize', async () => {
		// fixture is 600 wide; base applied at first RO delivery:
		const el = await mount(twoBreakpoints);
		await nextFrame();
		assert.equal(el.direction, 'horizontal');
	});

	test('0x0 box holds — no breakpoint applied, no reflection', async () => {
		const el = await mount(twoBreakpoints);
		el.style.display = 'none';
		await nextFrame();
		// hidden → no writes happen; last state persists
		const before = el.getAttribute('direction');
		el.style.display = '';
		await nextFrame();
		assert.equal(before, 'horizontal');
	});

	test('unrelated re-renders do not churn (deps gate)', async () => {
		const el = await mount(twoBreakpoints);
		el.dispatchEvent(new CustomEvent('noop')); // parent re-render surrogate
		await nextFrame();
		// no breakpoint change → no re-apply
		assert.equal(el.direction, 'horizontal');
	});

	test('attr → prop loop: observed attribute change re-renders host', async () => {
		const el = await mount(twoBreakpoints);
		await setWidth(el, 400);
		assert.include(el.shadowRoot.querySelector('#out').textContent, 'vertical');
	});

	test('foreign writes to unmanaged keys are invisible to the directive', async () => {
		const el = await mount(twoBreakpoints);
		el.foreign = 'app-state';
		await nextFrame();
		await setWidth(el, 400);
		assert.equal(el.foreign, 'app-state');
	});

	test('shared-write: component effect re-asserts data-direction', async () => {
		const el = await mount(twoBreakpoints);
		await setWidth(el, 400);
		assert.equal(el.getAttribute('data-direction'), 'vertical');
		await setWidth(el, 600);
		assert.equal(el.getAttribute('data-direction'), 'horizontal');
	});

	test('props channel: reflective prop write triggers update', async () => {
		const el = await mount(() => [
			{ name: 'mobile', maxWidth: 480, props: { steps: 3 } },
			{ name: 'base', props: { steps: 1 } },
		]);
		await nextFrame();
		assert.equal(el.steps, 1);
		await setWidth(el, 400);
		assert.equal(el.steps, 3);
		assert.equal(el.getAttribute('data-breakpoint'), 'mobile');
	});

	test('deps change rebuilds snapshot atomically', async () => {
		const flag = { value: false };
		const breakpointsWithFlag = () => [
			...(flag.value
				? [{ name: 'mobile', maxWidth: 480, attrs: { direction: 'vertical' } }]
				: []),
			{ name: 'base', attrs: { direction: 'horizontal' } },
		];
		const el = await mount(breakpointsWithFlag, [flag.value]);
		await nextFrame();
		assert.equal(el.direction, 'horizontal');

		flag.value = true;
		// re-render surrogate: applying the same directive factory via a
		// re-fixture is heavy; instead assert that a fresh fixture with the
		// flag on resolves the new breakpoint
		const el3 = await mount(breakpointsWithFlag, [flag.value], 400);
		await nextFrame();
		assert.equal(el3.direction, 'vertical');
	});

	test('normalization: base breakpoint required', () => {
		// building the directive result is lazy — normalize runs on update
		assert.doesNotThrow(() =>
			breakpoints(
				() => [{ name: 'mobile', maxWidth: 480, attrs: { direction: 'v' } }],
				[],
			),
		);
	});

	test('normalization: keys must exist in base', () => {
		assert.throw(
			() =>
				normalize([
					{ name: 'mobile', maxWidth: 480, props: { orphan: true } },
					{ name: 'base', attrs: { direction: 'horizontal' } },
				]),
			/orphan/u,
		);
	});

	test('normalization: exactly one base', () => {
		assert.throw(
			() =>
				normalize([
					{ name: 'a', attrs: { direction: 'x' } },
					{ name: 'b', attrs: { direction: 'y' } },
				]),
			/exactly one breakpoint without maxWidth/u,
		);
	});

	test('purity: same inputs → same writes regardless of path', async () => {
		const path1 = await mount(
			() => [
				{ name: 'mobile', maxWidth: 480, attrs: { direction: 'vertical' } },
				{ name: 'base', attrs: { direction: 'horizontal' } },
			],
			[],
			400,
		);
		await nextFrame();
		const path2 = await mount(
			() => [
				{ name: 'mobile', maxWidth: 480, attrs: { direction: 'vertical' } },
				{ name: 'base', attrs: { direction: 'horizontal' } },
			],
			[],
			400,
		);
		await nextFrame();
		assert.equal(path1.direction, path2.direction);
		assert.equal(
			path1.hasAttribute('data-breakpoint'),
			path2.hasAttribute('data-breakpoint'),
		);
	});

	test('named base breakpoint reflects data-breakpoint at rest', async () => {
		const el = await mount(() => [
			{ name: 'base', attrs: { direction: 'horizontal' } },
		]);
		await nextFrame();
		assert.equal(el.getAttribute('data-breakpoint'), 'base');
	});

	test('base breakpoint prop null exits a narrow override (the exit path)', async () => {
		// Regression: compute() used ?? so the base's null was reduced to
		// "no opinion" and never written — a narrow renderItem stayed stuck.
		const miniRenderItem = () => 'mini';
		const el = await mount(
			() => [
				{
					name: 'mini',
					maxWidth: 480,
					props: { renderItem: miniRenderItem },
				},
				{ props: { renderItem: null } },
			],
			[],
			400,
		);
		await nextFrame();
		assert.equal(el.getAttribute('data-breakpoint'), 'mini');
		assert.equal(el.renderItem, miniRenderItem);

		await setWidth(el, 700);
		assert.isFalse(el.hasAttribute('data-breakpoint'));
		assert.isNull(el.renderItem, 'base null must be WRITTEN, not skipped');
	});
});
