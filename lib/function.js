const identity = obj => obj,
	or = (...fns) => (...args) => fns.reduce((res, fn) => res || fn(...args), false),
	once = (fn, check) => {
		let result; // eslint-disable-next-line no-return-assign
		return (...args) => result ??= check(args) ? fn(...args) : undefined;
	};

export {
	identity,
	once,
	or
};
