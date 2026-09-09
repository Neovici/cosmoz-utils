---
'@neovici/cosmoz-utils': minor
---

Add `share$` promise combinator: broadcasts the result of the wrapped function to every pending caller. Compose with `debounce$` to collapse N concurrent identical calls into one invocation that resolves all callers, e.g. `share$(debounce$(fn, 320))`.
