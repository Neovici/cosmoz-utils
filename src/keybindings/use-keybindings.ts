import { useCallback, useEffect } from '@pionjs/pion';
import { useMeta } from '../hooks/use-meta';
import {
	Activity,
	ActivityHandler,
	KeyBinding,
	Matcher,
	RegisterFn,
} from './types';

declare global {
	interface ObjectConstructor {
		entries(o: Matcher): [keyof Matcher, Matcher[keyof Matcher]][];
	}
}

const matches =
	(e: KeyboardEvent) =>
	([matcher]: KeyBinding) =>
		Object.entries(matcher).every(([key, value]) => e[key] === value);

const isInteractive = (el: Element | null | undefined) => {
	if (el == null) return false;

	const bounds = el.getBoundingClientRect(),
		root = el.getRootNode() as ShadowRoot | Document,
		topEl = root.elementFromPoint(
			bounds.x + bounds.width / 2,
			bounds.y + bounds.height / 2,
		);

	return el === topEl;
};

const getActiveElement = (
	root: Document | ShadowRoot = document,
): Element | null => {
	const activeEl = root.activeElement;

	if (!activeEl) {
		return null;
	}

	if (activeEl.shadowRoot) {
		return getActiveElement(activeEl.shadowRoot);
	}

	return activeEl;
};

const focusIsInEditableArea = (): boolean => {
	const active = getActiveElement(document);

	if (!active) return false;
	if (active.matches('input, textarea')) return true;
	if ('isContentEditable' in active && active.isContentEditable) {
		return true;
	}

	return false;
};

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
