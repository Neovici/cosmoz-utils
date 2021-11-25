/**
 * Creates a mixin with the specified functions applied to the superclass
 *
 * ```js
 * import { mixin, Money } from '@neovici/cosmoz-utils';
 * import { isEmpty } from '@neovici/cosmoz-utils/template';
 * import { isoDate } from '@neovici/cosmoz-utils/date';
 *
 * class DemoMoneyHelper extends mixin({isEmpty, isoDate, ...Money}, PolymerElement) {
 * ```
 *
 * @mixinFunction
 * @demo demo/index.html
 * @param  {object} helpers   the functions to add to the class
 * @param  {class} superclass the class to extend
 * @return {class}            a new class
 */
const mixin = (helpers, superclass) => {
	/**
	 * @polymer
	 * @mixinClass
	 */
	const MixedElement = class extends superclass {};
	Object.assign(MixedElement.prototype, helpers);
	return MixedElement;
};

import * as Template from './lib/template';
import * as DateUtils from './lib/date';
import * as Money from './lib/money';

import { hauntedPolymer } from './lib/haunted-polymer';

// TODO remove deprecated Date export [issue #34]
export {
	hauntedPolymer,
	Template,
	DateUtils,
	mixin,
	Money,
	DateUtils as Date
};

export * from './lib/tagged';
