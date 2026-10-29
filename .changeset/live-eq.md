---
'@neovici/cosmoz-utils': minor
---

Add `liveEq` (`cosmoz-utils/live-eq`): a `live` directive with pluggable equality. The dirty check runs the element's current value and the bound value through `eq(currentElementValue, boundValue)` instead of comparing with `===`, for bindings where the element normalizes the bound value internally — `input.value` coerces numbers to strings, so `live(2)` rewrites the element's text on every render and resets the caret. Ships `stringEquals` and a NaN-safe `numericEquals` (partially typed numbers like `2.` never blank out). With no `eq`, behaves exactly like `live`.
