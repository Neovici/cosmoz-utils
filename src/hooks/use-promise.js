import { useReducer, useEffect } from '@pionjs/pion';
import { reduce, action } from '../reduce';

const states = {
		pending: 'pending',
		rejected: 'rejected',
		resolved: 'resolved',
	},
	initial = {
		error: undefined,
		result: undefined,
		state: states.pending,
	},
	pending = action(states.pending),
	resolved = action(states.resolved, (result) => ({ result })),
	rejected = action(states.rejected, (error) => ({ error })),
	reducer = reduce(initial, [
		[
			pending,
			() => ({
				error: undefined,
				result: undefined,
				state: states.pending,
			}),
		],

		[
			resolved,
			(state, { result }) => ({
				error: undefined,
				result,
				state: states.resolved,
			}),
		],

		[
			rejected,
			(state, { error }) => ({
				error,
				result: undefined,
				state: states.rejected,
			}),
		],
	]);

export const usePromise = (promise) => {
	const [{ error, result, state }, dispatch] = useReducer(reducer, initial);

	useEffect(() => {
		if (!promise) {
			return;
		}

		let canceled = false;

		dispatch(pending());

		promise.then(
			(result) => !canceled && dispatch(resolved(result)),
			(error) => !canceled && dispatch(rejected(error)),
		);

		return () => {
			canceled = true;
		};
	}, [promise]);

	return [result, error, state];
};
