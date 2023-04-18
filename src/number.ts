export const parse = (value?: string | number) => {
	if (!value || value === Infinity) return;
	if (typeof value === 'number') return value;
	const num = parseFloat(
		value
			.replace(/[\s]/gu, '')
			.replace(/^−/gu, '-')
			.replace(/[,.]/gu, '.')
			.replace(/[.](?=.*[.])/gu, '')
	);
	if (isNaN(num)) return;
	return num;
};

export const round = (num: number, precision = 2) =>
	parse(num.toFixed(precision));

export const patternNumber = /^[0-9.,e-]+$/u;
export const patternInteger = /^[0-9]+$/u;
