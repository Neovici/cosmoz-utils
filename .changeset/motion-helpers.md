---
'@neovici/cosmoz-utils': minor
---

Add `@neovici/cosmoz-utils/motion`: `prefersReducedMotion`, `useReducedMotion`, and `scopedTransition(scope, update, { ready, timeout, types })`, which runs an update as a view transition scoped to one element. It waits for `ready` for at most `timeout` (250ms) and falls back to a plain update without element-scoped view transitions or under reduced motion.
