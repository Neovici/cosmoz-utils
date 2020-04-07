export const create = (
	type,
	payload,
	meta
) => ({
	type,
	...payload !== undefined ? { payload } : {},
	...meta !== undefined ? { meta } : {}
});

export const action = (type, executor = resolve => () => resolve()) => {
	const callable = executor((payload, meta) =>
		create(type, payload, meta)
	);
	return Object.assign(callable, {
		type,
		toString() {
			return type;
		}
	});
};

export const type = action => action.type || action.toString();
