/* eslint-disable func-style */
import { identity } from './function';

const isIterable = (x: unknown): x is Iterable<unknown> => {
	return typeof x === 'object' && x !== null && Symbol.iterator in x;
};

export function array(): [];
export function array(arr: null): [];
export function array<T>(arr: T[]): T[];
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

// TODO: Improve definition
export const without =
	(exclude: unknown, predicate = identity) =>
	(list: unknown) => {
		const excludes = array(exclude).map(predicate);
		return array(list).filter((value) => !excludes.includes(predicate(value)));
	};
