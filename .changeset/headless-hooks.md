---
'@neovici/cosmoz-utils': minor
---

New headless hooks for accessible composite components, modelled on Base UI:

- `useListNavigation` and `nextIndex` (`cosmoz-utils/hooks/use-list-navigation`): the highlighted index of a list driven by Arrow, Home/End and PageUp/PageDown keys, with wrapping and disabled items.
- `useActiveDescendant` (`cosmoz-utils/hooks/use-active-descendant`): points a control's `aria-controls` and `aria-activedescendant` at a listbox and its highlighted option through ARIA element reflection, which reaches across shadow roots into ancestor scopes.
