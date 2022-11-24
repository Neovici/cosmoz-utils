/* eslint-disable no-use-before-define, import/group-exports */
import { identity } from './function';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Rec<K extends PropertyKey = PropertyKey, V = any> = Record<K, V>;

export function prop(): typeof identity;
export function prop(a: '' | null | false | undefined | 0): typeof identity;
export function prop<K extends PropertyKey>(
	key: K
): <O extends Rec<K>>(obj: O) => O[K];
export function prop<K extends PropertyKey>(key?: K) {
	if (!key) {
		return identity;
	}
	return <O extends Rec<K>>(obj: O) => obj[key];
}

export const strProp = <K extends PropertyKey>(key: K) => {
	const p = prop(key);
	return <O extends Rec<K>>(o: O) => {
		if (typeof o === 'string') {
			return o;
		}
		return (p(o) as unknown as { toString: () => string })?.toString() || '';
	};
};

export const transform = <K extends string, V, RK extends PropertyKey, RV>(
	obj: Record<K, V>,
	trans: (entries: [Extract<K, string>, V][]) => Iterable<readonly [RK, RV]>
) =>
	Object.fromEntries(
		trans(Object.entries(obj) as [Extract<K, string>, V][])
	) as { [key in RK]: RV };

export const omit =
	<K extends PropertyKey>(keys: K[]) =>
	<T extends Rec>(obj: T): { [key in Exclude<keyof T, K>]: T[key] } => {
		const ret: Rec = {};

		for (const key in obj) {
			if (!(keys as PropertyKey[]).includes(key)) {
				ret[key] = obj[key];
			}
		}
		return ret as Omit<T, K>;
	};

export const props =
	<K extends PropertyKey>(keys: K[]) =>
	<T extends Rec>(obj: T): { [key in K & keyof T]: T[key] } => {
		const ret: Rec = {};
		for (const key in obj) {
			if ((keys as PropertyKey[]).includes(key)) {
				ret[key] = obj[key];
			}
		}
		return ret as Pick<T, K>;
	};

type Merge<T1, T2> = { [key in Exclude<keyof T1, keyof T2>]: T1[key] } & {
	[key in Exclude<keyof T2, keyof T1>]: T2[key];
} & {
	[key in keyof T1 & keyof T2]: T1 extends Rec
		? T2 extends Rec
			? Merge<T1[key], T2[key]>
			: T2[key]
		: T2[key];
};

export const isObject = (obj: unknown): obj is object =>
	obj != null && typeof obj === 'object' && obj.constructor === Object;

export function merge<T1, T2, T3>(
	a1: T1,
	a2: T2,
	a3: T3
): Merge<Merge<T1, T2>, T3>;
export function merge<T1, T2>(a1: T1, b2: T2): Merge<T1, T2>;
export function merge(...objs: Rec[]): Rec;
export function merge(...objs: Rec[]): Rec {
	return objs.reduce((acc, obj) => {
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
	}, {});
}
