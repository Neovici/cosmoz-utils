type OrFn<T> = (...args: T[]) => boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Arr = any[];

type OnceFn<A extends Arr, R> = (...args: A) => R;
type OnceCheckFn<A extends Arr> = (args: A) => boolean | undefined;

export function constant(): () => undefined;
export function constant<T>(v: T): () => T;
export function constant<T>(v?: T) {
	return () => v;
}

export const constTrue = constant<true>(true),
	constUndefined = constant(),
	noop = constUndefined,
	identity = <T>(obj: T) => obj,
	or =
		<A, F extends OrFn<A>>(...fns: F[]) =>
		(...args: A[]) =>
			fns.reduce((res, fn) => res || fn(...args), false);

export const once = <A extends Arr, R, F extends OnceFn<A, R> = OnceFn<A, R>>(
	fn: F,
	check: OnceCheckFn<A> = constTrue,
) => {
	let result;
	return (...args: A) => (result ??= check(args) ? fn(...args) : undefined);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InvokedType<T> = T extends (...args: any[]) => infer R ? R : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InvokedParameters<F> = F extends (...args: infer A) => any
	? A
	: never;

export function invoke<F>(
	fn: F,
	...args: InvokedParameters<F>
): InvokedType<F> {
	return typeof fn === 'function' ? fn(...args) : fn;
}
