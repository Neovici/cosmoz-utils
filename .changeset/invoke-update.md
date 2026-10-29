---
'@neovici/cosmoz-utils': patch
---

`invoke`'s typing expresses the value-or-function contract directly — a thing, or a function giving that thing — `T | ((...args: A) => T)` over `[...A, ...unknown[]]`, returning `T`. A same-shape union whose value member is a generic (`Partial<T> | ((values: T) => Partial<T>)`) no longer collapses to `unknown`, so call sites that spread or assign the result compile again; known functions keep their minimum-arity and parameter type checks; extras beyond the fn's tuple are no longer flagged (the value member ignores them, the function drops them). Follows #270.
