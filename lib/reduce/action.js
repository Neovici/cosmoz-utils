const create = (
		type,
		payload,
		meta
	) => ({
		type,
		...payload !== undefined ? { payload } : {},
		...meta !== undefined ? { meta } : {}
	}),
	action = (type, executor = resolve => () => resolve()) => {
		const callable = executor((payload, meta) =>
			create(type, payload, meta)
		);
		return Object.assign(callable, {
			type,
			toString() {
				return type;
			}
		});
	},
	type = action => action.type || action.toString();


export {
	action, create, type
};
