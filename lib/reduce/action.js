const action = (type, create = () => ({})) => {
		const common = {
				type,
				toString() {
					return type;
				}
			},
			callable = (...args) => Object.assign(create(...args), common);
		return Object.assign(callable, common);
	},
	type = action => action.type || action.toString();


export {
	action, type
};
