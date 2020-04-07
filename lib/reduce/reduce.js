import { type } from './action';

const array = x => Array.isArray(x) ? x : [x];

export const reduce = (initial, handler) => {
	const handles = array(handler((actions, handle) => ({
		actions: array(actions).map(type),
		handle
	})));

	return (state = initial, action) => {
		const handler = handles.find(h => h.actions.includes(type(action)));
		return handler ? handler.handle(state, action) : state;
	};
};
