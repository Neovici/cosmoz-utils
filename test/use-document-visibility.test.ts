import { component } from '@pionjs/pion';
import { useDocumentVisibility } from '../src/hooks/use-document-visibility';
import { html, fixture, expect } from '@open-wc/testing';
import { spy } from 'sinon';

interface UseDocumentVisibilityElement extends HTMLElement {
	visibility: string;
}
// set a custom property on custom-webcomponent
customElements.define(
	'use-document-visibility',
	component((host) => {
		host.visibility = useDocumentVisibility();
	}),
);

suite('useDocumentVisibility', () => {
	let originalVisibilityState: string;

	// cleanup between tests and set the initial test state
	setup(() => {
		originalVisibilityState = document.visibilityState;
	});

	test('should return initial document visibility state', async () => {
		const result = (await fixture(
			html`<use-document-visibility></use-document-visibility>`,
		)) as UseDocumentVisibilityElement;

		expect(result.visibility).to.equal('visible');
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

		expect(result.visibility).to.equal('visible');

		mockVisibility = 'hidden';

		const event = new Event('visibilitychange');
		document.dispatchEvent(event);

		await new Promise((resolve) => setTimeout(resolve, 10));

		expect(result.visibility).to.equal('hidden');
	});

	test('should attach and remove event listener', async () => {
		const addEventListenerSpy = spy(document, 'addEventListener');
		const removeEventListenerSpy = spy(document, 'removeEventListener');

		const result = await fixture(
			html`<use-document-visibility></use-document-visibility>`,
		);

		expect(addEventListenerSpy.calledWith('visibilitychange')).to.be.true;

		result.remove();

		expect(removeEventListenerSpy.calledWith('visibilitychange')).to.be.true;

		addEventListenerSpy.restore();
		removeEventListenerSpy.restore();
	});
});
