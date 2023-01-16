import { identity } from './function';

export const hashUrl = () =>
		new URL(
			location.hash.replace(/^#!?/iu, '').replace('%23', '#'),
			location.origin
		),
	singleParse = (hashParam: string, codec = identity) => {
		const values = new URLSearchParams(hashUrl().hash.replace('#', '')).getAll(
			hashParam
		);

		if (Array.isArray(values)) {
			return values.length === 1 ? codec(values[0]) : values.map(codec);
		}

		return codec(values);
	},
	multiParse = (hashParam: string, codec = identity) => {
		const params = Array.from(
			new URLSearchParams(hashUrl().hash.replace('#', '')).entries()
		)
			.filter(([param]) => param.startsWith(hashParam))
			.map(([param, value]) => codec([param.replace(hashParam, ''), value]))
			.filter(([, value]) => value != null);

		return Object.fromEntries(params);
	};
