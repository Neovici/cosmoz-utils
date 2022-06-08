import { html as htm } from 'haunted';

const html = (arr, ...thru) =>
	htm(
		Object.assign(arr, { raw: true }),
		...thru
	);

export const
	/**
	 * Dynamic component support for lit-html.
	 *
	 * Normally lit-html does not support interpolating the component tag, but we can trick it
	 * by calling the template function manually.
	 *
	 * NOTE: You can only use this function for interpolating a single tag and it must be the
	 * first interpolated value. If you need multiple components, you can do multiple interpolations.
	 *
	 * @example
	 *  tag`<${name} some=${param}/>`
	 *
	 * @example
	 * 	html`A: ${ tag`<${ aTag }/>` } - B: ${ tag`${ bTag }` }`
	 *
	 * @param   {string[]}     strings    The static strings.
	 * @param   {string}       component  The interpolated component name.
	 * @param   {any[]}        values     The interpolated values.
	 *
	 * @return  {TemplateResult}          The lit template result.
	 */
	tag = (strings, component, ...values) => html([
		strings[0] + component + strings[1],
		...strings.slice(2)
	], ...values);
