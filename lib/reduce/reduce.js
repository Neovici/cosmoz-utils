import { type } from './action';

const ensureArray = x => Array.isArray(x) ? x : [x];

export const reduce = (initial, handler) => {
	const handles = ensureArray(handler((actions, handle) => ({
		actions: ensureArray(actions).map(type),
		handle
	})));

	return (state = initial, action) => {
		const handler = handles.find(h => h.actions.includes(type(action)));
		return handler ? handler.handle(state, action) : state;
	};
};
