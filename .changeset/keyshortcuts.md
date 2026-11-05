---
'@neovici/cosmoz-utils': minor
---

Keybindings can tell the UI their key combos:

- `useShortcut(activity)` returns `keyshortcuts` (for `aria-keyshortcuts`) and `label` (`⌘K` on Apple platforms, `Ctrl+K` elsewhere) for the app's bindings of that activity.
- `keyShortcut(matcher)`, `keyLabel(matcher)` and `shortcutsFor(bindings, activity)` format them outside components.
- The register function from `useKeybindings` carries the app's `bindings`, so a shortcuts help screen can list them.
