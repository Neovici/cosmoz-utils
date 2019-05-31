@neovici/cosmoz-utils
=================

[![Build Status](https://travis-ci.org/Neovici/cosmoz-behaviors.svg?branch=master)](https://travis-ci.org/Neovici/cosmoz-behaviors)
[![Sauce Test Status](https://saucelabs.com/buildstatus/nomego)](https://saucelabs.com/u/nomego)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/Neovici/cosmoz-behaviors)

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
