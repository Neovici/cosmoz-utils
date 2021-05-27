import { identity } from './function';

const array = arr => {
		if (arr == null) {
			return [];
		}
		if (Array.isArray(arr)) {
			return arr;
		}
		if (typeof arr === 'string') {
			return [arr];
		}
		if (typeof arr[Symbol.iterator] === 'function') {
			return Array.from(arr);
		}
		return [arr];
	},
	without = (exclude, predicate = identity) => list => {
		const excludes = array(exclude).map(predicate);
		return array(list).filter(value => !excludes.includes(predicate(value)));
	};


export {
	array,
	without
};
