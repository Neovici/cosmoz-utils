import { component } from '@pionjs/pion';
import { useDocumentVisibility } from '../src/hooks/use-document-visibility';
import { html, fixture, expect, assert } from '@open-wc/testing';
import { spy } from 'sinon';

interface UseDocumentVisibilityElement extends HTMLElement {
	visibility: boolean;
}
// set a custom property on custom-webcomponent
customElements.define(
	'use-document-visibility',
	component((host) => {
		host.visibility = useDocumentVisibility();
	}),
);

suite('useDocumentVisibility', () => {
	test('should return initial document visibility state', async () => {
		const result = (await fixture(
			html`<use-document-visibility></use-document-visibility>`,
		)) as UseDocumentVisibilityElement;

		assert.isTrue(result.visibility);
	});

	test('should update when visibility changes', async () => {
		let mockVisibility = 'visible';
		Object.defineProperty(document, 'visibilityState', {
			get() {
				return mockVisibility;
			},
			configurable: true,
		});

		const result = (await fixture(
			html`<use-document-visibility></use-document-visibility>`,
		)) as UseDocumentVisibilityElement;
		assert.isTrue(result.visibility);

		mockVisibility = 'hidden';

		const event = new Event('visibilitychange');
		document.dispatchEvent(event);

		await new Promise((resolve) => setTimeout(resolve, 10));
		assert.isFalse(result.visibility);
	});

	test('should attach and remove event listener', async () => {
		const addEventListenerSpy = spy(document, 'addEventListener');
		const removeEventListenerSpy = spy(document, 'removeEventListener');

		const result = await fixture(
			html`<use-document-visibility></use-document-visibility>`,
		);

		assert.isTrue(addEventListenerSpy.calledWith('visibilitychange'));

		result.remove();

		assert.isTrue(removeEventListenerSpy.calledWith('visibilitychange'));

		addEventListenerSpy.restore();
		removeEventListenerSpy.restore();
	});
});
