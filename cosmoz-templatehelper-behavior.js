/*global Cosmoz */

(function () {

	"use strict";

	/**
	 * @polymerBehavior
	 */
	Cosmoz.TemplateHelperBehavior = {
		abs: Math.abs,
		/**
		 * Helper function to see if any of the arguments are true
		 * @return {Boolean} [description]
		 */
		anyTrue: function () {
			var argumentArray = Array.prototype.slice.call(arguments);
			return argumentArray.some(function (arg) {
				return !!arg;
			});
		},
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
		},
		toFixed: function (number, fixval) {
			return number.toFixed(fixval);
		}
	};

	Cosmoz.CommonBehaviors.push(Cosmoz.TemplateHelperBehavior);
}());