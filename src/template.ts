export const
	abs = Math.abs,
	/**
	 * Check if any of the arguments are true.
	 * @return {Boolean} Whether any of the function arguments are true or not.
	 */
	anyTrue =  <T>(...args: T[]) =>args.some(arg => !!arg),
	/**
	 * Concatenate all arguments to a string.
	 * @return {string} Concatenated arguments.
	 */
	concat = <T>(...args: T[])=> args.join(''),
	/**
	 * If iftrue argument is true, return result argument, otherwise return elseresult argument.
	 * @param {boolean} iftrue Codition for result
	 * @param {*} result Result when iftrue is true.
	 * @param {*} elseresult Result when iftrue is false.
	 * @return {boolean} result or elseresult depending on iftrue evaluation.
	 */
	ifElse =  <T extends boolean, R,E>(iftrue: T, result:R , elseresult: E)=> iftrue ? result : elseresult,
	/**
	 * Check if item argument exists in array argument.
	 * @param {*} item Item to search for in the array.
	 * @param {array} array Array to search.
	 * @return {boolean} Whether the item was found in array or not.
	 */
	inArray =  <T>(item: T, array: T[]) => array.indexOf(item) > -1,
	/**
	 * Check equality of the arguments.
	 * @param {*} arg1 First argument to compare.
	 * @param {*} arg2 Second argument to compare
	 * @return {boolean} Whether the first and second arguments are equal or not.
	 */
	isEqual =  <T>(arg1:T, arg2: T)=> arg1 === arg2,
	/**
	 * Check if argument is undefined, null, empty Array list,
	 * empty String or 0 number (like length).
	 * @param	 {object}	 obj Argument to evaluate.
	 * @return {boolean}	Whether the argument is empty or not.
	 */
	isEmpty = <T>(obj: T) =>{
		if (obj === undefined || obj === null) {
			return true;
		}
		if (Array.isArray(obj)  && obj.length === 0) {
			return true;
		}
		if (typeof obj === 'string' && obj.length === 0) {
			return true;
		}
		if (typeof obj === 'number' && obj === 0) {
			return true;
		}
		return false;
	},
	/**
	 * Formats a number using fixed-point notation.
	 * @param {number} number Number with decimals to be formatted.
	 * @param {number} fixval Number of decimals to use.
	 * @return {String} The number converted to string keep only fixval number of decimals, if number empty, returns empty string
	 */
	toFixed = <T>(number:T, fixval: number) => {
		if (typeof number !== 'number') {
			return '';
		}
		return number.toFixed(fixval);
	};
