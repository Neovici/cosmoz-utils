import { assert, fixture, html, oneEvent } from '@open-wc/testing';
import { connectable } from '../src/connectable';

suite('connectable', () => {
	let el;

	suiteSetup(() => {
		class ConnectableElement extends connectable(HTMLElement) {
			constructor() {
				super();
				this.attachShadow({ mode: 'open' });
				this.shadowRoot.innerHTML = '<slot></slot>';
			}
		}
		customElements.define('test-connectable', ConnectableElement);
	});

	test('dispatches "connected" event when attached to DOM', async () => {
		const container = await fixture(html`<div></div>`);
		el = document.createElement('test-connectable');

		setTimeout(() => container.appendChild(el));
		const event = await oneEvent(el, 'connected');

		assert.instanceOf(event, CustomEvent);
		assert.equal(event.type, 'connected');
	});

	test('dispatches "disconnected" event when removed from DOM', async () => {
		el = await fixture(html`<test-connectable></test-connectable>`);

		setTimeout(() => el.remove());
		const event = await oneEvent(el, 'disconnected');

		assert.instanceOf(event, CustomEvent);
		assert.equal(event.type, 'disconnected');
	});

	test('works with default HTMLElement base', () => {
		const MixedClass = connectable();
		assert.isFunction(MixedClass);
		assert.isTrue(MixedClass.prototype instanceof HTMLElement);
	});

	test('works with custom base class', () => {
		class CustomBase extends HTMLElement {
			customMethod() {
				return 'custom';
			}
		}
		const MixedClass = connectable(CustomBase);
		assert.isTrue(MixedClass.prototype instanceof CustomBase);
	});
});
