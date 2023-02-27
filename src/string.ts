export const ucfirst = (text: string) =>
	text.charAt(0).toUpperCase() + text.slice(1);

export const lcfirst = (text: string) =>
	text.charAt(0).toLowerCase() + text.slice(1);

export const capitalize = (text: string) =>
	text
		?.trim()
		.split(/\s+/u)
		.map((w) => ucfirst(w))
		.join(' ');
