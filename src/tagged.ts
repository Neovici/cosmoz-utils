export const tagged = (strings: string[], ...values: string[]) =>
	strings.flatMap((s, i) => [s, values[i] || '']).join('');
