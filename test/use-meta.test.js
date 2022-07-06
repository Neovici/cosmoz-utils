import { useMeta } from '../src/hooks/use-meta';
import { component } from 'haunted';
import {
	assert,
	html,
	fixture
} from '@open-wc/testing';

customElements.define(
	'use-meta',
	component(host => {
		host.current = useMeta(host.meta);
	})
);

suite('useMeta', () => {
	test('memoizes meta', async () => {
		const meta = {
				a: 1,
				b: 2
			},
			result = await fixture(html`<use-meta .meta=${ meta }></use-meta>`);

		assert.notEqual(meta, result.current);
		assert.deepEqual(meta, result.current);

	});
});
