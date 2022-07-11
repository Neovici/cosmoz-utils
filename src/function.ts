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
			fns.reduce((res, fn) => res || fn(...args), false),
	once = <A, R, F extends OnceFn<A, R>>(
		fn: F,
		check: OnceCheckFn<A> = constTrue
	) => {
		let result;
		return (...args: A[]) => (result ??= check(args) ? fn(...args) : undefined);
	};
