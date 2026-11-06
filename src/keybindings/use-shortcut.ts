import { useContext } from '@pionjs/pion';
import { Keybindings } from './context';
import { shortcutsFor } from './format';
import { Activity } from './types';

/**
 * The app's key combos for `activity`: `keyshortcuts` for the
 * `aria-keyshortcuts` attribute of the element that performs it, and
 * `label` to show in its tooltip. Both are undefined when nothing is bound.
 */
export const useShortcut = (activity: Activity) =>
	shortcutsFor(useContext(Keybindings).bindings, activity);
