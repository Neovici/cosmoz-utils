export const pageLocale = (locale?: string) =>
	locale || globalThis.document?.documentElement.lang || undefined;
