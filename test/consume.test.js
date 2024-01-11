import { assert, fixture, html } from '@open-wc/testing';
import { createContext } from '@pionjs/pion';
import { consume } from '../src/directives/consume';

const Theme = createContext('light');
customElements.define('theme-provider', Theme.Provider);

const AppState = createContext({ loggedIn: false });
customElements.define('app-state-provider', AppState.Provider);

suite('consume directive', () => {
	test('gives access to the current context value', async () => {
		const el = await fixture(
			html`<theme-provider .value=${'light'}
				>${consume(Theme)}</theme-provider
			>`,
		);
		assert.equal(el.textContent, 'light');
	});

	test('uses the default value if no provider exists', async () => {
		const el = await fixture(html`<p>${consume(Theme)}</p>`);
		assert.equal(el.textContent, 'light');
	});

	test('re-renders when the context value is updated', async () => {
		const el = await fixture(
			html`<theme-provider .value=${'light'}
				>${consume(Theme)}</theme-provider
			>`,
		);
		el.value = 'dark';
		assert.equal(el.textContent, 'dark');
	});

	test('works for attribute parts', async () => {
		const el = await fixture(
			html`<theme-provider .value=${'light'}
				><h1 theme=${consume(Theme)}>Heading</h1></theme-provider
			>`,
		);
		assert.dom.equal(
			el,
			`<theme-provider>
                <h1 theme="light">
                    Heading
                </h1>
            </theme-provider>`,
		);

		el.value = 'dark';
		assert.dom.equal(
			el,
			`<theme-provider>
                <h1 theme="dark">
                    Heading
                </h1>
            </theme-provider>`,
		);
	});

	test('you can pluck data from the context', async () => {
		const el = await fixture(
			html`<app-state-provider .value=${{ loggedIn: false }}
				><span>Logged in:</span> ${consume(AppState, ({ loggedIn }) =>
					loggedIn ? 'Yes' : 'No',
				)}</app-state-provider
			>`,
		);
		assert.dom.equal(
			el,
			'<app-state-provider><span>Logged in:</span> No</app-state-provider>',
		);

		el.value = { loggedIn: true };
		assert.dom.equal(
			el,
			'<app-state-provider><span>Logged in:</span> Yes</app-state-provider>',
		);
	});
});
