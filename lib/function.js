const identity = obj => obj,
	or = (...fns) => (...args) => fns.reduce((res, fn) => res || fn(...args), false);

export {
	identity,
	or
};
