import { assert } from '@open-wc/testing';
import '../src/elements/cosmoz-announcer';

const settle = () =>
	new Promise<void>((resolve) =>
		requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
	);

const announcer = (message?: string) => {
	const el = Object.assign(document.createElement('cosmoz-announcer'), {
		message,
	});
	document.body.append(el);
	return el;
};

suite('announcer', () => {
	test('renders a polite, atomic, visually hidden region with the message', async () => {
		const el = announcer('Required');
		await settle();
		const region = el.shadowRoot!.querySelector('.announcer')!;
		assert.equal(region.getAttribute('aria-live'), 'polite');
		assert.equal(region.getAttribute('aria-atomic'), 'true');
		const style = getComputedStyle(region);
		assert.include(style.clip || style.clipPath, 'rect');
		assert.equal(region.textContent, 'Required');
	});

	test('releases the message after 1 s so it can re-arm', async () => {
		const el = announcer('Required');
		await settle();
		assert.equal(
			el.shadowRoot!.querySelector('.announcer')!.textContent,
			'Required',
		);
		await new Promise((r) => setTimeout(r, 1100));
		await settle();
		assert.equal(el.shadowRoot!.querySelector('.announcer')!.textContent, '');
		el.message = '';
		await settle();
		el.message = 'Required';
		await settle();
		assert.equal(
			el.shadowRoot!.querySelector('.announcer')!.textContent,
			'Required',
		);
	});

	test('clears the region at once when the message empties', async () => {
		const el = announcer('Required');
		await settle();
		el.message = '';
		await settle();
		assert.equal(el.shadowRoot!.querySelector('.announcer')!.textContent, '');
	});
});
