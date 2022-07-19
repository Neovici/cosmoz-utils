export const tagged = (
	strings: TemplateStringsArray,
	...values: (string | number)[]
) => strings.flatMap((s, i) => [s, values[i] || '']).join('');
