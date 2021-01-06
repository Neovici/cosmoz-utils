import {
	assert, fixture, nextFrame
} from '@open-wc/testing';
import {
	component, html, useState
} from 'haunted';
import { tag } from '../lib/tag';

suite('tag', () => {
	test('interpolate component', async () => {
		const component = 'h1',
			content = 'Content',
			result = await fixture(html`<div>Component: ${ tag`<${ component }>${ content }` }`);

		assert.equal(result.tagName, 'DIV');
		assert.equal(result.firstElementChild.tagName, 'H1');
	});

	const MyComponent = () => {
		const [component, setComponent] = useState('span');

		return html`
				<button id="h1" @click=${ () => setComponent('h1') }>H1</button>
				<button id="h2" @click=${ () => setComponent('h2') }>H2</button>

				${ tag`<${ component } id="output">Text` }
			`;
	};

	customElements.define('tag-dynamic-component-test', component(MyComponent));

	test('dynamic component', async () => {
		const el = await fixture(html`<tag-dynamic-component-test></tag-dynamic-component-test>`);
		await nextFrame();

		assert.equal(el.shadowRoot.querySelector('#output').tagName, 'SPAN');

		el.shadowRoot.querySelector('#h1').click();
		await nextFrame();

		assert.equal(el.shadowRoot.querySelector('#output').tagName, 'H1');

		el.shadowRoot.querySelector('#h2').click();
		await nextFrame();

		assert.equal(el.shadowRoot.querySelector('#output').tagName, 'H2');
	});
});

