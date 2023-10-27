import { useAbortSignal } from '../src/hooks/use-abort-signal';
import { component } from 'haunted';
import { assert, html, fixture } from '@open-wc/testing';
import { spy } from 'sinon';

customElements.define(
	'use-abort-signal',
	component((host) => {
		host.current = useAbortSignal();
	}),
);

suite('useAbortSignal', () => {
	test('creates an abort signal', async () => {
		const result = await fixture(html`<use-abort-signal></use-abort-signal>`);

		assert.isOk(result.current);
		assert.instanceOf(result.current, AbortSignal);
	});

	test('signal aborts when the component is destroyed', async () => {
		const result = await fixture(html`<use-abort-signal></use-abort-signal>`);
		const abortSignal = result.current;
		const abortSpy = spy();

		abortSignal.addEventListener('abort', abortSpy);

		assert.isFalse(abortSignal.aborted);
		assert.isFalse(abortSpy.called);
		result.parentNode.removeChild(result);
		assert.isTrue(abortSignal.aborted);
		assert.isTrue(abortSpy.calledOnce);
	});
});
