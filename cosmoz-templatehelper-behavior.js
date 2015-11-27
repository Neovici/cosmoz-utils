/*global Cosmoz */

(function () {

	"use strict";

	/**
	 * @polymerBehavior
	 */
	Cosmoz.TemplateHelperBehavior = {
		/**
		 * Concatenate all arguments to a string
		 */
		concat: function () {
			return Array.prototype.join.call(arguments, '');
		},
		/**
		 * Check if variable is undefined, null, empty Array list,
		 * empty String or 0 number (like length).
		 * @param  {Object}  obj variable
		 * @return {Boolean}  true if "empty", false otherwise
		 */
		isEmpty: function (obj) {
			if (obj === undefined || obj === null) {
				return true;
			}
			if (obj instanceof Array && obj.length === 0) {
				return true;
			}
			var objType = typeof obj;
			if (objType === 'string' && obj.length === 0) {
				return true;
			}
			if (objType === 'number' && obj === 0) {
				return true;
			}
			return false;
		}
	};

	Cosmoz.CommonBehaviors.push(Cosmoz.TemplateHelperBehavior);
}());