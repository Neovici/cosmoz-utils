---
'@neovici/cosmoz-utils': minor
---

`timeago`, `renderAmount`, `renderMoney` and `renderNumberAmount` without a locale now format in the page's language (`<html lang>`) and fall back to the browser's language only when the page sets none.
