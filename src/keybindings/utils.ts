import { KeyBinding, Matcher } from './types';

declare global {
	interface ObjectConstructor {
		entries(o: Matcher): [keyof Matcher, Matcher[keyof Matcher]][];
	}
}
export const matches =
	(e: KeyboardEvent) =>
	([matcher]: KeyBinding) =>
		Object.entries(matcher).every(([key, value]) => e[key] === value);

export const isInteractive = (el: Element | null | undefined) => {
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

export const focusIsInEditableArea = (): boolean => {
	const active = getActiveElement(document);

	if (!active) return false;
	if (active.matches('input, textarea')) return true;
	if ('isContentEditable' in active && active.isContentEditable) {
		return true;
	}

	return false;
};
