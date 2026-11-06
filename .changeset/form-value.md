---
'@neovici/cosmoz-utils': minor
---

New `FormControlElement` base class (`cosmoz-utils/elements/form-control-element`) and `useFormValue` hook (`cosmoz-utils/hooks/use-form-value`) for form-associated pion components. Pass the class as `component(fn, { baseElement: FormControlElement })`; the hook submits the value through `ElementInternals`, sets `valueMissing` and other validity flags, and handles form reset, state restore and disabling by a `<fieldset>`.
