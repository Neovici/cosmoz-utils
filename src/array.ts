import { identity } from './function';

const isIterable = (x: unknown): x is Iterable<unknown> => {
	return typeof x === 'object' && x !== null && Symbol.iterator in x;
};

export function array(): [];
export function array(arr: null): [];
export function array<T>(arr?: T | T[]): T[];
export function array<T>(arr: Iterable<T>): T[];
export function array<T = unknown>(arr: T): T[];
export function array(arr?: unknown) {
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
}

export const without =
	<E, L = E>(
		exclude: E | E[],
		predicate: <T extends E | L>(value: T) => unknown = identity
	) =>
	<T extends L = L>(list: T | T[]) => {
		const excludes = array(exclude).map(predicate);
		return array(list).filter((value) => !excludes.includes(predicate(value)));
	};

export const chunk = <T>(list: T[], size: number) =>
	[...Array(Math.ceil(list.length / size)).keys()].map((i) =>
		list.slice(i * size, (i + 1) * size)
	);

export const intersect = <T>(list: T[][]) => {
	const [first = [], ...rest] = list.sort();
	return first.filter((e) => rest.every((arr) => arr.includes(e)));
};
