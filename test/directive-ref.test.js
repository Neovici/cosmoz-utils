import { component } from 'haunted';
import {
	assert,
	html,
	fixture
} from '@open-wc/testing';
import { ref } from '../lib/directives/ref';

customElements.define(
	'test-ref',
	component(({ testRef }) => html`<div class="test-ref">${ ref(testRef) }</div>`)
);

customElements.define(
	'test-ref-attr',
	component(({ testRef }) => html`<div class="test-ref" ref=${ ref(testRef) }></div>`)
);

suite('ref', () => {
	test('add node to ref\'s current', async () => {
		const testRef = {},
			component = await fixture(html`<test-ref .testRef=${ testRef }></test-ref>`);
		assert.equal(testRef.current, component.shadowRoot.querySelector('div'));
	});
	test('add attr\'s commiter node to ref\'s current', async () => {
		const testRef = {},
			component = await fixture(html`<test-ref-attr .testRef=${ testRef }></test-ref-attr>`);
		assert.equal(testRef.current, component.shadowRoot.querySelector('div'));
	});
});
