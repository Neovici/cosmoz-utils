import { useCallback, useEffect } from '@pionjs/pion';
import { useMeta } from '../hooks/use-meta';
import { Activity, ActivityHandler, KeyBinding, RegisterFn } from './types';
import { focusIsInEditableArea, isInteractive, matches } from './utils';

type State = {
	bindings: readonly KeyBinding[];
	[k: Activity]: ActivityHandler[];
};

export const useKeybindings = (bindings: readonly KeyBinding[]): RegisterFn => {
	const meta = useMeta<State>({ bindings });

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.defaultPrevented) {
				return;
			}

			const binding = meta.bindings.find(matches(e));
			if (!binding) return;

			if (focusIsInEditableArea()) return;

			const [, activities] = binding;
			const handlers = activities.flatMap((activity) => meta[activity]);
			if (handlers.length === 0) return;

			// find first actionable handler
			const handler = handlers.find(
				(handler) => !handler.element || isInteractive(handler.element()),
			);
			if (!handler) return;

			e.preventDefault();
			handler.callback();
		};
		document.addEventListener('keydown', handler, true);
		return () => document.removeEventListener('keydown', handler, true);
	}, []);

	const register = useCallback((handler: ActivityHandler) => {
		meta[handler.activity] = [handler, ...(meta[handler.activity] ?? [])];

		return () => {
			meta[handler.activity] = meta[handler.activity]?.filter(
				(h) => h !== handler,
			);
		};
	}, []);

	return register;
};
