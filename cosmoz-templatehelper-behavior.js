/*global Cosmoz */
if (typeof Cosmoz === 'undefined') {
	var Cosmoz = {};
}

(function () {

	'use strict';

	/** @polymerBehavior */
	Cosmoz.TemplateHelperBehavior = {
		/**
		 * Math.abs
		 */
		abs: Math.abs,

		/**
		 * Helper function to see if any of the arguments are true
		 * @return {Boolean} true if any of the arguments are true
		 */
		anyTrue: function () {
			var argumentArray = Array.prototype.slice.call(arguments);
			return argumentArray.some(function (arg) {
				return !!arg;
			});
		},

		/**
		 * Concatenate all arguments to a string
		 * @return {String} String containing concatenated parameters
		 */
		concat: function () {
			return Array.prototype.join.call(arguments, '');
		},

		/**
		 * If iftrue is true, return result, otherwise return elseresult
		 * @param {Boolean} iftrue Codition for result
		 * @param  {*} result Result when iftrue is true
		 * @param {*} elseresult Result when iftrue is false
		 * @return {Boolean} result or elseresult depending on iftrue
		 */
		ifElse: function (iftrue, result, elseresult) {
			return iftrue ? result : elseresult;
		},

		/**
		 * Check if item exists in array
		 * @param {*} item The item to search for in the array
		 * @param {Array} array The array to search
		 * @return {Boolean} true if found
		 */
		inArray: function (item, array) {
			return array.indexOf(item) > -1;
		},

		/**
		 * Check equality
		 * @param {*} arg1 Object to compare
		 * @param {*} arg2 Objects to compare
		 * @return {Boolean} true if arg1 and arg2 are equal
		 */
		isEqual: function (arg1, arg2) {
			return arg1 === arg2;
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
		 * @param {Number} number The number argument
		 * @param {Number} fixval The number of decimals
		 * @return {String} The number converted to string keep only fixval number of decimals
		 */
		toFixed: function (number, fixval) {
			return number.toFixed(fixval);
		}
	};
}());