import { assert, fixture, html } from '@open-wc/testing';
import { component } from '@pionjs/pion';
import { spy } from 'sinon';
import { usePersist } from '../src/hooks/use-persist';

interface UsePersistElement extends HTMLElement {
	value: string;
	setValue: (v: string) => void;
	revalidate: () => string;
}

// set a custom property on custom-webcomponent
customElements.define(
	'use-persist',
	component((host) => {
		const { value, setValue, revalidate } = usePersist(
			'value',
			'test-key',
			'default',
		);
		(host as UsePersistElement).value = value;
		(host as UsePersistElement).setValue = setValue;
		(host as UsePersistElement).revalidate = revalidate;
	}),
);

suite('usePersist', () => {
	suite('with valid key', () => {
		setup(() => localStorage.removeItem('test-key'));
		teardown(() => localStorage.removeItem('test-key'));

		test('returns default value when no stored value', async () => {
			const result = (await fixture(
				html`<use-persist></use-persist>`,
			)) as UsePersistElement;
			assert.equal(result.value, 'default');
		});

		test('returns stored value from localStorage', async () => {
			localStorage.setItem('test-key', 'stored-value');
			const result = (await fixture(
				html`<use-persist></use-persist>`,
			)) as UsePersistElement;
			assert.equal(result.value, 'stored-value');
		});

		test('setValue persists to localStorage', async () => {
			const result = (await fixture(
				html`<use-persist></use-persist>`,
			)) as UsePersistElement;
			result.setValue('new-value');
			assert.equal(localStorage.getItem('test-key'), 'new-value');
		});

		test('setValue updates the property', async () => {
			const result = (await fixture(
				html`<use-persist></use-persist>`,
			)) as UsePersistElement;
			result.setValue('new-value');
			assert.equal(result.value, 'new-value');
		});

		test('revalidate returns stored value when different', async () => {
			await fixture(html`<use-persist></use-persist>`);
			localStorage.setItem('test-key', 'external-value');
			const el = (await fixture(
				html`<use-persist></use-persist>`,
			)) as UsePersistElement;
			const rev = el.revalidate();
			assert.equal(rev, 'external-value');
		});

		test('revalidate returns current value when same', async () => {
			const result = (await fixture(
				html`<use-persist></use-persist>`,
			)) as UsePersistElement;
			result.setValue('my-value');
			const rev = result.revalidate();
			assert.equal(rev, 'my-value');
		});

		test('listens for cross-tab storage events', async () => {
			const addSpy = spy(window, 'addEventListener');
			const result = (await fixture(
				html`<use-persist></use-persist>`,
			)) as UsePersistElement;

			assert.isTrue(addSpy.calledWith('storage'));
			result.remove();

			addSpy.restore();
		});

		test('updates value on storage event from another tab', async () => {
			const result = (await fixture(
				html`<use-persist></use-persist>`,
			)) as UsePersistElement;
			assert.equal(result.value, 'default');

			// Simulate storage event
			const event = new StorageEvent('storage', {
				key: 'test-key',
				newValue: 'cross-tab-value',
			});
			window.dispatchEvent(event);

			await new Promise((r) => setTimeout(r, 10));
			assert.equal(result.value, 'cross-tab-value');
		});
	});

	suite('with undefined key (no persistence)', () => {
		test('returns default value when key is undefined', async () => {
			customElements.define(
				'use-persist-no-key',
				component((host) => {
					const hook = usePersist as (
						prop: string,
						key: string | undefined,
						defaultValue: string,
					) => {
						value: string;
						setValue: (v: string) => void;
						revalidate: () => string;
					};
					const { value, setValue, revalidate } = hook(
						'value',
						undefined,
						'fallback',
					);
					(host as UsePersistElement).value = value;
					(host as UsePersistElement).setValue = setValue;
					(host as UsePersistElement).revalidate = revalidate;
				}),
			);
			const result = (await fixture(
				html`<use-persist-no-key></use-persist-no-key>`,
			)) as UsePersistElement;
			assert.equal(result.value, 'fallback');
		});

		test('setValue does not persist when key is undefined', async () => {
			customElements.define(
				'use-persist-no-key-set',
				component((host) => {
					const hook = usePersist as (
						prop: string,
						key: string | undefined,
						defaultValue: string,
					) => { value: string; setValue: (v: string) => void };
					const { value, setValue } = hook('value', undefined, 'fallback');
					(host as UsePersistElement).value = value;
					(host as UsePersistElement).setValue = setValue;
				}),
			);
			const result = (await fixture(
				html`<use-persist-no-key-set></use-persist-no-key-set>`,
			)) as UsePersistElement;
			result.setValue('new-value');
			assert.equal(result.value, 'new-value');
			// No error thrown from localStorage
		});
	});
});
