import { type } from './action';

const ensureArray = x => Array.isArray(x) ? x : [x],
	reduce = (initial, handle) => {
		const handles = ensureArray(handle),
			handlers = (handles.every(Array.isArray) ? handles : [handles]).map(([actions, handle]) => ({
				actions: ensureArray(actions).map(type),
				handle
			}));
		return (state = initial, action) => {
			const handler = handlers.find(h => h.actions.includes(type(action)));
			return handler ? handler.handle(state, action) : state;
		};
	};

export { reduce };
