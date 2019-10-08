@neovici/cosmoz-utils
=================

[![Build Status](https://github.com/Neovici/cosmoz-utils/workflows/Github%20CI/badge.svg)](https://github.com/Neovici/cosmoz-utils/actions?workflow=Github+CI)
[![Sauce Test Status](https://saucelabs.com/buildstatus/nomego)](https://saucelabs.com/u/nomego)
[![Maintainability](https://api.codeclimate.com/v1/badges/864f8d85f6b013e1caaa/maintainability)](https://codeclimate.com/github/Neovici/cosmoz-utils/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/864f8d85f6b013e1caaa/test_coverage)](https://codeclimate.com/github/Neovici/cosmoz-utils/test_coverage)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Cosmoz Utils

**cosmoz-utils** contains date, money and template management functions commonly
needed in page views. This package does not contain any visual element.

## Upgrade guide

Upgrading from `cosmoz-behaviors` is very straightforward.

* `Cosmoz.TemplateHelperBehavior` -> `import { Template } from '@neovici/cosmoz-utils'`
* `Cosmoz.MoneyHelperBehavior` -> `import { Money } from '@neovici/cosmoz-utils'`
* `Cosmoz.DateHelperBehavior` -> `import { Date } from '@neovici/cosmoz-utils'`
* `Polymer.mixinBehaviors([Cosmoz.TemplateHelperBehavior], Polymer.Element)` -> `mixin(Template, PolymerElement)`
* `Polymer.mixinBehaviors([Cosmoz.TemplateHelperBehavior, Cosmoz.MoneyHelperBehavior], Polymer.Element)` -> `mixin({...Template, ...Money}, PolymerElement)`

This code:

```js
<link rel="import" href="../cosmoz-templatehelper-behavior.html" />

class DemoTemplateHelper extends Polymer.mixinBehaviors([Cosmoz.TemplateHelperBehavior], Polymer.Element) {
```

Becomes:

```js
import { PolymerElement } from '@polymer/polymer/polymer-element';
import { mixin, Template } from '@neovici/cosmoz-utils';

class DemoTemplateHelper extends mixin(Template, PolymerElement) {
```

You can also pick and choose only the functions your element needs:

```js
import { mixin, Money } from '@neovici/cosmoz-utils';
import { isEmpty } from '@neovici/cosmoz-utils/template';
import { isoDate } from '@neovici/cosmoz-utils/date';

class DemoMoneyHelper extends mixin({isEmpty, isoDate, ...Money}, PolymerElement) {
```

### Big Thanks

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs][sauce_homepage]

[![Sauce Test Status](https://saucelabs.com/browser-matrix/nomego.svg)](https://saucelabs.com/u/nomego)
[sauce_homepage]: https://saucelabs.com
