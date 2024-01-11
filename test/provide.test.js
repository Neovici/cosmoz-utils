import { assert, fixture, html, nextFrame } from '@open-wc/testing';
import { component, createContext } from '@pionjs/pion';
import { provide } from '../src/directives/provide';

const Theme = createContext('light');
customElements.define('theme-consumer', Theme.Consumer);

const ProviderTest = ({ theme }) =>
	html`<p>
		${provide(Theme, theme)}
		<theme-consumer .render=${(theme) => theme}></theme-consumer>
	</p>`;
customElements.define(
	'provider-test',
	component(ProviderTest, { useShadowDOM: false }),
);

suite('provide directive', () => {
	test('provides a context value in the current node hierarchy', async () => {
		const el = await fixture(
			html`<provider-test .theme=${'dark'}></provider-test>`,
		);
		assert.lightDom.equal(el.querySelector('theme-consumer'), 'dark');
	});

	test('notifies of value changes', async () => {
		const el = await fixture(
			html`<provider-test .theme=${'dark'}></provider-test>`,
		);
		el.theme = 'colorful';
		await nextFrame();
		assert.lightDom.equal(el.querySelector('theme-consumer'), 'colorful');
	});
});
