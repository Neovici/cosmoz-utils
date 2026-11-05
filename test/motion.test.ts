import { assert, fixture, html, nextFrame } from '@open-wc/testing';
import { component } from '@pionjs/pion';
import { emulateMedia } from '@web/test-runner-commands';
import { spy } from 'sinon';
import {
	prefersReducedMotion,
	scopedTransition,
	useReducedMotion,
} from '../src/motion';

const fakeScope = () => {
	const scope = document.createElement('div') as HTMLDivElement & {
		startViewTransition: ReturnType<typeof spy>;
	};
	scope.startViewTransition = spy((arg) => {
		const update = typeof arg === 'function' ? arg : arg.update,
			done = update();
		return { ready: done, finished: done };
	});
	return scope;
};

customElements.define(
	'use-reduced-motion',
	component((host: HTMLElement & { reduced?: boolean }) => {
		host.reduced = useReducedMotion();
	}),
);

suite('motion', () => {
	teardown(() => emulateMedia({ reducedMotion: 'no-preference' }));

	test('runs update at once without element view transitions', async () => {
		const update = spy();
		await scopedTransition(document.createElement('div'), update);
		assert.isTrue(update.calledOnce);
	});

	test('runs update at once under reduced motion', async () => {
		await emulateMedia({ reducedMotion: 'reduce' });
		const scope = fakeScope(),
			update = spy();
		await scopedTransition(scope, update);
		assert.isTrue(update.calledOnce);
		assert.isFalse(scope.startViewTransition.called);
	});

	test('captures the new state when ready settles', async () => {
		const scope = fakeScope();
		let resolve!: () => void;
		const ready = new Promise<void>((r) => (resolve = r));
		let finished = false;
		const run = scopedTransition(scope, () => undefined, {
			ready,
			timeout: 5000,
		}).then(() => (finished = true));
		await nextFrame();
		assert.isFalse(finished);
		resolve();
		await run;
		assert.isTrue(finished);
	});

	test('never waits longer than timeout', async () => {
		const start = performance.now();
		await scopedTransition(fakeScope(), () => undefined, {
			ready: new Promise(() => undefined),
			timeout: 50,
		});
		assert.isBelow(performance.now() - start, 1000);
	});

	test('passes view transition types', async () => {
		const scope = fakeScope();
		await scopedTransition(scope, () => undefined, { types: ['forward'] });
		assert.deepEqual(scope.startViewTransition.firstCall.args[0].types, [
			'forward',
		]);
	});

	test('useReducedMotion follows the media query', async () => {
		const el = await fixture<HTMLElement & { reduced: boolean }>(
			html`<use-reduced-motion></use-reduced-motion>`,
		);
		assert.isFalse(el.reduced);
		await emulateMedia({ reducedMotion: 'reduce' });
		await nextFrame();
		assert.isTrue(el.reduced);
		assert.isTrue(prefersReducedMotion());
	});
});
