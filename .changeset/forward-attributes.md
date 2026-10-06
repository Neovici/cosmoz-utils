---
'@neovici/cosmoz-utils': minor
---

New directive `forwardAttributes` (`cosmoz-utils/directives/forward-attributes`): projects a map of attributes onto every flattened assigned element of the slot it is placed on. Values are strings, nulls (removal), or functions of the assigned element. Re-projects on every render and on slot changes; stops while disconnected, resumes on reconnect.
