const array = (arr = []) => {
		if (Array.isArray(arr)) {
			return arr;
		}
		if (Symbol.iterator in arr) {
			return Array.from(arr);
		}
		return [arr];
	},
	without = exclude => list => {
		const excludes = array(exclude);
		return array(list).filter(value => !excludes.includes(value));
	};

export {
	array,
	without
};
