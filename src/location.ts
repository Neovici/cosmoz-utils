import { identity } from './function';

export const hashUrl = () =>
	new URL(
		location.hash.replace(/^#!?/iu, '').replace('%23', '#'),
		location.origin,
	);

export const singleParse = <T = string>(
	hashParam: string,
	codec: (value: string) => T = identity as (value: string) => T,
): T | T[] | undefined => {
	const values = new URLSearchParams(hashUrl().hash.replace('#', '')).getAll(
		hashParam,
	);

	switch (values.length) {
		case 0:
			return undefined;
		case 1:
			return codec(values[0]);
		default:
			return values.map(codec);
	}
};

export const multiParse = <T = string>(
	hashParam: string,
	codec: (entry: [string, string]) => [string, T] = identity as (
		entry: [string, string],
	) => [string, T],
): Record<string, T> => {
	const params = Array.from(
		new URLSearchParams(hashUrl().hash.replace('#', '')).entries(),
	)
		.filter(([param]) => param.startsWith(hashParam))
		.map(([param, value]) => codec([param.replace(hashParam, ''), value]))
		.filter(([, value]) => value != null);

	return Object.fromEntries(params) as Record<string, T>;
};
