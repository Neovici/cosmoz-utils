import { expect, fixture, html } from '@open-wc/testing';
import { component, html as pionHtml } from '@pionjs/pion';
import {
	ANY_KEY,
	KeyBinding,
	keyLabel,
	keyShortcut,
	shortcutsFor,
	useKeybindings,
	useShortcut,
} from '../src/keybindings';

const search = Symbol('search'),
	menu = Symbol('menu'),
	unbound = Symbol('unbound');

const bindings: KeyBinding[] = [
	[{ key: 'k', metaKey: true }, [search], { title: '', description: '' }],
	[{ key: 'k', ctrlKey: true }, [search], { title: '', description: '' }],
	[{ key: 'a' }, [menu], { title: '', description: '' }],
	[{ key: ANY_KEY }, [menu], { title: '', description: '' }],
];

suite('keybindings format', () => {
	test('formats aria-keyshortcuts values', () => {
		expect(keyShortcut({ key: 'k', metaKey: true })).to.equal('Meta+K');
		expect(
			keyShortcut({ key: 'ArrowDown', ctrlKey: true, shiftKey: true }),
		).to.equal('Control+Shift+ArrowDown');
		expect(keyShortcut({ key: ' ', altKey: true })).to.equal('Alt+Space');
		expect(keyShortcut({ key: ANY_KEY })).to.equal(undefined);
	});

	test('formats labels per platform', () => {
		const matcher = { key: 'k', ctrlKey: true, shiftKey: true };
		expect(keyLabel(matcher, false)).to.equal('Ctrl+Shift+K');
		expect(keyLabel(matcher, true)).to.equal('⌃⇧K');
		expect(keyLabel({ key: 'k', metaKey: true }, true)).to.equal('⌘K');
		expect(keyLabel({ key: 'a' }, false)).to.equal('A');
	});

	test('collects every combo bound to an activity', () => {
		expect(shortcutsFor(bindings, search).keyshortcuts).to.equal(
			'Meta+K Control+K',
		);
		expect(shortcutsFor(bindings, menu).keyshortcuts).to.equal('A');
		expect(shortcutsFor(bindings, unbound)).to.deep.equal({});
		expect(shortcutsFor(undefined, search)).to.deep.equal({});
	});
});

customElements.define(
	'shortcut-button',
	component(() => {
		const { keyshortcuts } = useShortcut(search);
		return pionHtml`<button aria-keyshortcuts=${keyshortcuts ?? ''}>Search</button>`;
	}),
);

customElements.define(
	'shortcut-app',
	component(() => {
		const register = useKeybindings(bindings);
		return pionHtml`<cosmoz-keybinding-provider .value=${register}
			><slot></slot
		></cosmoz-keybinding-provider>`;
	}),
);

suite('useShortcut', () => {
	test('reads the app\'s bindings through the keybindings context', async () => {
		const el = await fixture(
			html`<shortcut-app><shortcut-button></shortcut-button></shortcut-app>`,
		);
		const button = el
			.querySelector('shortcut-button')!
			.shadowRoot!.querySelector('button')!;
		expect(button.getAttribute('aria-keyshortcuts')).to.equal(
			'Meta+K Control+K',
		);
	});

	test('is empty without a provider', async () => {
		const el = await fixture(html`<shortcut-button></shortcut-button>`);
		expect(
			el.shadowRoot!.querySelector('button')!.getAttribute('aria-keyshortcuts'),
		).to.equal('');
	});
});
