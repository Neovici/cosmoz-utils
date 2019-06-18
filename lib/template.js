export const abs = Math.abs;

/**
 * Check if any of the arguments are true.
 * @return {Boolean} Whether any of the function arguments are true or not.
 */
export const anyTrue = function () {
	const argumentArray = Array.prototype.slice.call(arguments);
	return argumentArray.some(arg => !!arg);
};

/**
 * Concatenate all arguments to a string.
 * @return {string} Concatenated arguments.
 */
export const concat = function () {
	return Array.prototype.join.call(arguments, '');
};

/**
 * If iftrue argument is true, return result argument, otherwise return elseresult argument.
 * @param {boolean} iftrue Codition for result
 * @param {*} result Result when iftrue is true.
 * @param {*} elseresult Result when iftrue is false.
 * @return {boolean} result or elseresult depending on iftrue evaluation.
 */
export const ifElse = function (iftrue, result, elseresult) {
	return iftrue ? result : elseresult;
};

/**
 * Check if item argument exists in array argument.
 * @param {*} item Item to search for in the array.
 * @param {array} array Array to search.
 * @return {boolean} Whether the item was found in array or not.
 */
export const inArray = function (item, array) {
	return array.indexOf(item) > -1;
};

/**
 * Check equality of the arguments.
 * @param {*} arg1 First argument to compare.
 * @param {*} arg2 Second argument to compare
 * @return {boolean} Whether the first and second arguments are equal or not.
 */
export const isEqual = function (arg1, arg2) {
	return arg1 === arg2;
};

/**
 * Check if argument is undefined, null, empty Array list,
 * empty String or 0 number (like length).
 * @param	 {object}	 obj Argument to evaluate.
 * @return {boolean}	Whether the argument is empty or not.
 */
export const isEmpty = function (obj) {
	if (obj === undefined || obj === null) {
		return true;
	}
	if (obj instanceof Array && obj.length === 0) {
		return true;
	}
	const objType = typeof obj;
	if (objType === 'string' && obj.length === 0) {
		return true;
	}
	if (objType === 'number' && obj === 0) {
		return true;
	}
	return false;
};

/**
 * Formats a number using fixed-point notation.
 * @param {number} number Number with decimals to be formatted.
 * @param {number} fixval Number of decimals to use.
 * @return {String} The number converted to string keep only fixval number of decimals, if number empty, returns empty string
 */
export const toFixed = function (number, fixval) {
	if (typeof number !== 'number') {
		return '';
	}
	return number.toFixed(fixval);
};
