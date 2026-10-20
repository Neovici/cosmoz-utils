---
'@neovici/cosmoz-utils': minor
---

Add an `overflow` directive (`cosmoz-utils/directives/overflow`):
placed on a slot, it marks assigned members whose box has zero
intersection with the slot's box with an `overflowing` attribute and
reports the marked set to `onOverflow` whenever it changes - a member
wrapped to a row past the band. Ported from cosmoz-tabs' next overflow
directive.

Also exports `overflowStyle`: the canonical band and mark styling as a
`CSSStyleSheet` - adopt it on the shadow host, mark the band slot with
the `cz-overflow-band` class, and keep the one-row `max-height` (and
any uncap variants) in the consumer's own styles.
