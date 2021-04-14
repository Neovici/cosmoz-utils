import { identity } from './function';

const prop = key => key && (object => object[key]) || identity,
	strProp = key => {
		const p = prop(key);
		return o => p(o)?.toString() || '';
	},
	isObject = obj => Object.prototype.toString.call(obj) === '[object Object]',
	merge = (...objs) => objs.reduce((acc, obj) => {
		if (obj == null) {
			return acc;
		}
		for (const key of Object.keys(obj)) {
			if (isObject(obj[key]) && isObject(acc[key])) {
				Object.assign(acc[key], merge(acc[key], obj[key]));
			} else if (Array.isArray(acc[key]) && Array.isArray(obj[key])) {
				acc[key] = acc[key].concat(obj[key]);
			} else {
				acc[key] = obj[key];
			}
		}
		return acc;
	}, {}),
	transform = predicate => obj => Object.fromEntries(predicate(Object.entries(obj)));


export {
	prop,
	strProp,
	isObject,
	merge,
	transform
};
