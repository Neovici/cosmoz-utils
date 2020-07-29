const array = (arr = []) => Array.isArray(arr) ? arr : [arr],
	without = exclude => list => {
		const excludes = array(exclude);
		return array(list).filter(value => !excludes.includes(value));
	};

export {
	array,
	without
};
