import { assert, fixture, html, nextFrame } from '@open-wc/testing';
import { component } from '@pionjs/pion';
import { assignedRef } from '../src/directives/assigned-ref';

customElements.define(
	'test-assigned-ref',
	/**
	 * the ref object comes in as a property: the test owns it the same
	 * way a consumer component does (its own ref passed to the directive)
	 */
	component(({ assignedRef: ref }) => html`<slot ${assignedRef(ref)}></slot>`),
);

const assigned = (el) =>
	el.shadowRoot.querySelector('slot').assignedElements({ flatten: true });

suite('assignedRef', () => {
	let el;
	let ref;
	let first;
	let second;

	setup(async () => {
		ref = { current: [] };
		el = await fixture(
			html`<test-assigned-ref .assignedRef=${ref}></test-assigned-ref>`,
		);
		first = document.createElement('button');
		first.className = 't1';
		second = document.createElement('button');
		second.className = 't2';
	});

	teardown(() => {
		el.remove();
	});

	test('writes the assigned elements into the ref', async () => {
		el.appendChild(first);
		await nextFrame();
		assert.deepEqual(ref.current, [first]);

		el.appendChild(second);
		await nextFrame();
		assert.deepEqual(ref.current, [first, second]);
	});

	test('tracks removals via slotchange', async () => {
		el.appendChild(first);
		el.appendChild(second);
		await nextFrame();
		assert.deepEqual(assigned(el), [first, second]);

		first.remove();
		await nextFrame();
		assert.deepEqual(ref.current, [second]);
	});

	test('a slotted wrapper is a member (no unwrapping)', async () => {
		const inner = document.createElement('div');
		inner.attachShadow({ mode: 'open' });
		inner.shadowRoot.innerHTML = '<slot></slot>';
		inner.appendChild(first);
		el.appendChild(inner);
		await nextFrame();
		// a member's shadow projection is never traversed: the wrapper
		// host is the member
		assert.deepEqual(assigned(el), [inner]);
	});

	test('a nested instance members the outer ref (flat-tree)', async () => {
		// <test-assigned-ref><test-assigned-ref><button></...></...>: the
		// inner instance's slot members the outer instance's slot; the
		// outer ref reports the button
		const innerEl = await fixture(
			html`<test-assigned-ref .assignedRef=${ref}
				><button class="inner-btn"></button
			></test-assigned-ref>`,
		);
		await nextFrame();
		el.appendChild(innerEl);
		await nextFrame();
		const button = innerEl.shadowRoot
			.querySelector('slot')
			.assignedElements({ flatten: true })[0];
		assert.deepEqual(assigned(el), [innerEl]);
		assert.deepEqual(ref.current, [button]);
	});

	test('empty slot writes an empty array', async () => {
		await nextFrame();
		assert.deepEqual(ref.current, []);
	});

	test('stops tracking while disconnected, resumes on reconnect', async () => {
		el.appendChild(first);
		await nextFrame();
		assert.deepEqual(ref.current, [first]);

		// the listener is removed while disconnected: assignment changes
		// during this window are not written
		el.remove();
		el.appendChild(second);
		await nextFrame();
		assert.deepEqual(ref.current, [first]);

		// on reconnect, update() rebinds and re-projects the current members
		document.body.appendChild(el);
		await nextFrame();
		assert.deepEqual(ref.current, [first, second]);
	});
});
