type OrFn<T> = (...args: T[]) => boolean;

type OnceFn<A, R> = (...args: A[]) => R;
type OnceCheckFn<T> = (args: T[]) => boolean | undefined;

export const constant =
		<T>(v?: T) =>
		() =>
			v,
	constTrue = constant(true),
	constUndefined = constant(),
	noop = constUndefined,
	identity = <T>(obj: T) => obj,
	or =
		<A, F extends OrFn<A>>(...fns: F[]) =>
		(...args: A[]) =>
			fns.reduce((res, fn) => res || fn(...args), false);

export const once = <A, R>(
	fn: OnceFn<A, R>,
	check: OnceCheckFn<A> = constTrue
) => {
	let result;
	return (...args: A[]) => (result ??= check(args) ? fn(...args) : undefined);
};

export function invoke<A, R, F extends (...args: A[]) => R>(
	fn: F,
	...args: A[]
): ReturnType<F>;
export function invoke<F>(fn: F, ...args: unknown[]): F;
export function invoke<F, A>(fn: F, ...args: A[]) {
	return typeof fn === 'function' ? fn(...args) : fn;
}
