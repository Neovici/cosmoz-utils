import { identity } from './function';

const prop = key => key && (object => object[key]) || identity,
	strProp = key => {
		const p = prop(key);
		return o => p(o)?.toString() || '';
	};

export {
	prop,
	strProp
};
