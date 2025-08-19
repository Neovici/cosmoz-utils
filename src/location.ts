import { identity } from './function';

export const hashUrl = () =>
		new URL(
			location.hash.replace(/^#!?/iu, '').replace('%23', '#'),
			location.origin,
		),
	singleParse = (hashParam: string, codec = identity) => {
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
	},
	multiParse = (hashParam: string, codec = identity) => {
		const params = Array.from(
			new URLSearchParams(hashUrl().hash.replace('#', '')).entries(),
		)
			.filter(([param]) => param.startsWith(hashParam))
			.map(([param, value]) => codec([param.replace(hashParam, ''), value]))
			.filter(([, value]) => value != null);

		return Object.fromEntries(params);
	};
