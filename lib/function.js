const
	constant = v => () => v,
	constTrue = constant(true),
	constUndefined = constant(),
	noop = constUndefined,
	identity = obj => obj,
	or = (...fns) => (...args) => fns.reduce((res, fn) => res || fn(...args), false),
	once = (fn, check = constTrue) => {
		let result; // eslint-disable-next-line no-return-assign
		return (...args) => result ??= check(args) ? fn(...args) : undefined;
	};

export {
	constant,
	constTrue,
	constUndefined,
	noop,
	identity,
	once,
	or
};
