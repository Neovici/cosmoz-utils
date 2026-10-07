---
'@neovici/cosmoz-utils': patch
---

`invoke`'s type handles value-or-function unions (`string | ((item) => string)`). The return type is conditional on `F` — a function yields its own return, a plain value yields itself — and the arguments are checked against the function's own parameter tuple where TypeScript knows the callee. For unions (and opaque values), arguments stay admissible: the runtime dispatch (`typeof fn === 'function'`) decides which member runs. Runtime unchanged.
