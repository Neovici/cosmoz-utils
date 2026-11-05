import { ANY_KEY } from './consts';
import { Activity, KeyBinding, Matcher } from './types';

const modifiers = [
	['ctrlKey', 'Control', 'Ctrl', '⌃'],
	['altKey', 'Alt', 'Alt', '⌥'],
	['shiftKey', 'Shift', 'Shift', '⇧'],
	['metaKey', 'Meta', 'Meta', '⌘'],
] as const;

const keyName = (key: string) => {
	if (key === ' ') return 'Space';
	return key.length === 1 ? key.toUpperCase() : key;
};

const isMac = () =>
	/mac|iphone|ipad/iu.test(globalThis.navigator?.platform ?? '');

/** The combo as an `aria-keyshortcuts` value, e.g. `Meta+K`. */
export const keyShortcut = (matcher: Matcher) =>
	matcher.key === ANY_KEY
		? undefined
		: [
				...modifiers.filter(([prop]) => matcher[prop]).map(([, aria]) => aria),
				keyName(matcher.key),
			].join('+');

/** The combo as shown to users: `⌘K` on Apple platforms, `Ctrl+K` elsewhere. */
export const keyLabel = (matcher: Matcher, mac = isMac()) => {
	if (matcher.key === ANY_KEY) return undefined;
	const mods = modifiers.filter(([prop]) => matcher[prop]),
		key = keyName(matcher.key);
	return mac
		? mods.map(([, , , symbol]) => symbol).join('') + key
		: [...mods.map(([, , label]) => label), key].join('+');
};

/** The bindings that trigger `activity`, formatted for ARIA and for display. */
export const shortcutsFor = (
	bindings: readonly KeyBinding[] | undefined,
	activity: Activity,
) => {
	const matchers = (bindings ?? [])
		.filter(([, activities]) => activities.includes(activity))
		.map(([matcher]) => matcher)
		.filter((m) => m.key !== ANY_KEY);
	if (matchers.length === 0) return {};
	return {
		/** For `aria-keyshortcuts`: every combo, space separated. */
		keyshortcuts: matchers.map(keyShortcut).join(' '),
		/** For a tooltip or menu: the first combo. */
		label: keyLabel(matchers[0]),
	};
};
