type Creator<T extends [], R extends object> = (...args: T) => R;

export interface Action<T = unknown> {
	type?: T;
	toString: () => string;
}

const action = <T, A extends [], R extends object>(
		type: T,
		create: Creator<A, R> = () => ({} as R)
	) => {
		const common = {
				type,
				toString() {
					return type;
				},
			},
			callable = (...args: A) => Object.assign(create(...args), common);
		return Object.assign(callable, common);
	},
	type = <T>(action: Action<T>) => action.type || action.toString();

export { action, type };
