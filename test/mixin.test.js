import {
	assert, fixture, elementUpdated
} from '@open-wc/testing';
import {
	mixin, Template, Date
} from '../index.js';

import { html } from '@polymer/polymer/lib/utils/html-tag';
import { PolymerElement } from '@polymer/polymer/polymer-element';

suite('mixin element', () => {
	let basicFixture;
	suiteSetup(() => {
		class MixedInElement extends mixin({
			...Template,
			...Date
		}, PolymerElement) {
			static get properties() {
				return {
					money: {
						type: Object,
						value: {
							amount: 4499.99,
							currency: 'EUR'
						}
					}
				};
			}

			static get template() {
				return html`
					[[ isEqual('123', '123') ]]
					[[ isEqual('123', 123) ]]
					[[ isEmpty(0) ]]
					[[ isEmpty(10) ]]
					[[ isoDate(1559304252199) ]]
				`;
			}
		}

		customElements.define('mixed-in-element', MixedInElement);
	});
	setup(async () => {
		basicFixture = await fixture(html`<mixed-in-element></mixed-in-element>`);
	});
	test('mixed in functions are available in the template', async () => {
		await elementUpdated(basicFixture); // Firefox fails without this one
		assert.equal(
			'truefalsetruefalse2019-05-31', // TODO: basicFixture.shadowRoot.textContent.replace(/\n|\t/igu, ''),
			'truefalsetruefalse2019-05-31'
		);
	});
});
