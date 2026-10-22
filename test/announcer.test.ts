import { assert } from '@open-wc/testing';
import { html } from '@pionjs/pion';
import '../src/elements/cosmoz-announcer';
import { mount, nextFrame, update } from './helpers';

interface AppProps {
	message?: string;
}

const App = (host: HTMLElement & AppProps) =>
	html`<cosmoz-announcer .message=${host.message}></cosmoz-announcer>`;

const region = (host: HTMLElement & AppProps) =>
	host
		.shadowRoot!.querySelector('cosmoz-announcer')!
		.shadowRoot!.querySelector('.announcer')!;

suite('announcer', () => {
	test('renders a polite, atomic, visually hidden region with the message', async () => {
		const host = await mount(App, { message: 'Required' });
		const el = region(host);
		assert.equal(el.getAttribute('aria-live'), 'polite');
		assert.equal(el.getAttribute('aria-atomic'), 'true');
		const clip = getComputedStyle(el).clip;
		assert.include(clip || String(getComputedStyle(el).clip), 'rect');
		assert.equal(el.textContent, 'Required');
	});

	test('releases the message after 1 s so it can re-arm', async () => {
		const host = await mount(App, { message: 'Required' });
		assert.equal(region(host).textContent, 'Required');
		await new Promise((r) => setTimeout(r, 1100));
		await nextFrame();
		assert.equal(region(host).textContent, '');
		await update(host, { message: '' });
		await update(host, { message: 'Required' });
		assert.equal(region(host).textContent, 'Required');
	});

	test('clears the region at once when the message empties', async () => {
		const host = await mount(App, { message: 'Required' });
		await update(host, { message: '' });
		assert.equal(region(host).textContent, '');
	});
});
