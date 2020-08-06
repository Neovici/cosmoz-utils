const array = (arr = []) => {
		if (Array.isArray(arr)) {
			return arr;
		}
		if (typeof arr === 'string') {
			return [arr];
		}
		if (typeof arr[Symbol.iterator] === 'function') {
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
