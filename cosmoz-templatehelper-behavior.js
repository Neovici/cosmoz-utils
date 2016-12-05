/*global Cosmoz */
if (typeof Cosmoz === 'undefined') {
	var Cosmoz = {};
}

(function () {

	"use strict";

	/**
	 * @polymerBehavior
	 */
	Cosmoz.TemplateHelperBehavior = {
		/**
		 * Math.abs
		 */
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
		 * If iftrue is true, return result, otherwise return elseresult
		 */
		ifElse: function (iftrue, result, elseresult) {
			return iftrue ? result : elseresult;
		},
		/**
		 * Check if item exists in array
		 */
		inArray: function (item, array) {
			return array.indexOf(item) > -1;
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
		/**
		 * Helper for Number.toFixed(arg)
		 */
		toFixed: function (number, fixval) {
			return number.toFixed(fixval);
		}
	};
	
}());