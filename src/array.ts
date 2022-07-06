import { identity } from './function';

const isIterable = (x: unknown): x is Iterable<unknown> => {
	return typeof x === 'object' && x !== null && Symbol.iterator in x;
};

export const array = (arr: unknown) => {
		if (arr == null) {
			return [];
		}
		if (Array.isArray(arr)) {
			return arr;
		}
		if (typeof arr === 'string') {
			return [arr];
		}
		if (isIterable(arr)) {
			return Array.from(arr);
		}
		return [arr];
	},
	// TODO: Improve definition
	without =
		(exclude: unknown, predicate = identity) =>
		(list: unknown) => {
			const excludes = array(exclude).map(predicate);
			return array(list).filter(
				(value) => !excludes.includes(predicate(value))
			);
		};
