import { useImperativeApi } from '../lib/hooks/use-imperative-api';
import {
	component, useCallback
} from 'haunted';
import {
	assert,
	html,
	fixture
} from '@open-wc/testing';

customElements.define(
	'use-imperative-api-test',
	component(() => {
		const method = useCallback(() => true, []);

		useImperativeApi({ method }, [method]);
	})
);

suite('use-imperative-api', () => {
	test('exposes an imperative api on the component', async () => {
		const el = await fixture(html`<use-imperative-api-test></use-imperative-api-test>`);
		assert.isFunction(el.method);
		assert.isTrue(el.method());
	});
});
