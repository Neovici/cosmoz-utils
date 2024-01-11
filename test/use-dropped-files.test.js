import { useDroppedFiles } from '../src/hooks/use-dropped-files';
import { component } from '@pionjs/pion';
import { assert, html, fixture, nextFrame } from '@open-wc/testing';

customElements.define(
	'use-dropped-files',
	component(function ({ el }) {
		// eslint-disable-next-line no-invalid-this
		this.current = useDroppedFiles(el);
	})
);

suite('use-dropped-files', () => {
	test('dropped files', async () => {
		const el = document.createElement('div'),
			result = await fixture(html`<use-dropped-files .el=${el} />`),
			file = new File(['foo'], 'foo.txt', {
				type: 'text/plain',
			});

		el.dispatchEvent(
			Object.assign(new Event('drop'), { dataTransfer: { files: [file] } })
		);

		await nextFrame();
		assert.equal(result.current[0], file);
	});
});
