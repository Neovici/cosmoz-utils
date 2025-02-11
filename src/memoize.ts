type SameAs<T extends (...args: any) => any> = (
	...args: Parameters<T>
) => ReturnType<T>;

const sym = Symbol('memo');
export const memize = <T extends () => ReturnType<T>>(fn: T): SameAs<T> => {
		let called = false,
			lastResult: ReturnType<T>;
		return function () {
			if (called) {
				return lastResult;
			}
			const result = fn();
			lastResult = result;
			called = true;
			return result;
		};
	},
	memoize = <T extends (arg: any) => ReturnType<T>>(fn: T): SameAs<T> => {
		let lastArg: Parameters<T>[0] = sym,
			lastResult: ReturnType<T>;
		return function (arg: Parameters<T>[0]) {
			if (lastArg === arg) {
				return lastResult;
			}

			const result = fn(arg);
			lastResult = result;
			lastArg = arg;
			return result;
		};
	},
	memooize = <T extends (arg1: any, arg2: any) => ReturnType<T>>(
		fn: T,
	): SameAs<T> => {
		let lastArg1: Parameters<T>[0] = sym,
			lastArg2: Parameters<T>[1] = sym,
			lastResult: ReturnType<T>;
		return function (arg1: Parameters<T>[0], arg2: Parameters<T>[1]) {
			if (lastArg1 === arg1 && lastArg2 === arg2) {
				return lastResult;
			}

			const result = fn(arg1, arg2);
			lastResult = result;
			lastArg1 = arg1;
			lastArg2 = arg2;
			return result;
		};
	},
	memoooize = <T extends (arg1: any, arg2: any, arg3: any) => ReturnType<T>>(
		fn: T,
	): SameAs<T> => {
		let lastArg1: Parameters<T>[0] = sym,
			lastArg2: Parameters<T>[1] = sym,
			lastArg3: Parameters<T>[2] = sym,
			lastResult: ReturnType<T>;
		return function (
			arg1: Parameters<T>[0],
			arg2: Parameters<T>[1],
			arg3: Parameters<T>[2],
		) {
			if (lastArg1 === arg1 && lastArg2 === arg2 && lastArg3 === arg3) {
				return lastResult;
			}

			const result = fn(arg1, arg2, arg3);
			lastResult = result;
			lastArg1 = arg1;
			lastArg2 = arg2;
			lastArg3 = arg3;
			return result;
		};
	};
