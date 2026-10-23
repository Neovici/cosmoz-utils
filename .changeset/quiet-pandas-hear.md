---
'@neovici/cosmoz-utils': minor
---

Add `cosmoz-announcer` (`cosmoz-utils/elements/cosmoz-announcer`): a polite live region a component renders to keep its own announcements working (visually hidden, `aria-atomic`). It announces the `.message` and releases it after ~1 s so re-rendering the same text doesn't re-announce it.
