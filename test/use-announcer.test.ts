import { assert } from '@open-wc/testing';
import { html } from '@pionjs/pion';
import { useAnnouncer } from '../src/hooks/use-announcer';
import { mount, nextFrame, update } from './helpers';

interface Props {
	message: string;
	delay?: number;
}

const Status = (host: HTMLElement & Props) =>
	html`<span aria-live="polite"
		>${useAnnouncer(host.message, host.delay)}</span
	>`;

const text = (el: HTMLElement) =>
	el.shadowRoot!.querySelector('span')!.textContent!.trim();

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

suite('useAnnouncer', () => {
	test('announces a message after the delay', async () => {
		const el = await mount(Status, { message: '3 results', delay: 50 });
		assert.equal(text(el), '');
		await wait(80);
		await nextFrame();
		assert.equal(text(el), '3 results');
	});

	test('only announces the last of several quick messages', async () => {
		const el = await mount(Status, { message: '10 results', delay: 60 });
		const seen: string[] = [];
		const observer = new MutationObserver(() => seen.push(text(el)));
		observer.observe(el.shadowRoot!, {
			subtree: true,
			childList: true,
			characterData: true,
		});
		await update(el, { message: '4 results' });
		await update(el, { message: '1 result' });
		await wait(90);
		await nextFrame();
		observer.disconnect();
		assert.equal(text(el), '1 result');
		assert.deepEqual(seen.filter(Boolean), ['1 result']);
	});

	test('clears at once when the message is empty', async () => {
		const el = await mount(Status, { message: '3 results', delay: 20 });
		await wait(50);
		await nextFrame();
		assert.equal(text(el), '3 results');
		await update(el, { message: '' });
		assert.equal(text(el), '');
	});

	test('defaults to a 500 ms delay', async () => {
		const el = await mount(Status, { message: '3 results' });
		await wait(250);
		await nextFrame();
		assert.equal(text(el), '');
		await wait(350);
		await nextFrame();
		assert.equal(text(el), '3 results');
	});
});
