const CURRENCY_FORMATTERS = {},
	NUMBER_FORMATTERS = {},
	_getCurrencyFormatter = function (currency, locale) {
		if (currency == null) {
			return;
		}
		const key = currency.toUpperCase() + (locale || '');
		if (CURRENCY_FORMATTERS[key] == null) {
			CURRENCY_FORMATTERS[key] = new Intl.NumberFormat(locale, {
				style: 'currency',
				currency
			});
		}
		return CURRENCY_FORMATTERS[key];
	};

/**
 * Determine if a constant or a variable is an amount.
 * @param {object} potentialAmount Potential amount.
 * @returns {boolean} Whether the potential amount is a valid amount object with amount and currency.
 */
export const isAmount = function (potentialAmount) {
	return potentialAmount != null &&
		potentialAmount.amount != null &&
		potentialAmount.currency != null &&
		typeof potentialAmount.amount === 'number' &&
		typeof potentialAmount.currency === 'string' &&
		potentialAmount.currency.length === 3;
};

/**
 * Render an amount with decimal separator and currency symbol.
 * @param	 {object} money Money with amount property and optionally currency property.
 * @param	{void|string} locale Locale to format the amount in.
 * @return {string} Formatted amount.
 */
export const renderAmount = function (money, locale) {
	if (money == null) {
		return;
	}
	const formatter = _getCurrencyFormatter(money.currency, locale);
	if (formatter == null) {
		return;
	}
	return formatter.format(money.amount);
};

/**
 * Alias for renderAmount(money). Render an amount with decimal separator and currency symbol.
 * @param	 {object} money Money with amount property and optionally currency property.
 * @return {string} Formatted amount.
 */
export const renderMoney = renderAmount;

/**
 * Render an amount with decimal separator but without currency symbol.
 * @param	 {object} money Money with amount property and optionally currency property.
 * @param	{void|string} locale Locale to format the amount in.
 * @return {string} Formatted number.
 */
export const renderNumberAmount = function (money, locale) {
	const key = locale || '0';
	if (NUMBER_FORMATTERS[key] == null) {
		NUMBER_FORMATTERS[key] = new Intl.NumberFormat(locale, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	}
	return NUMBER_FORMATTERS[key].format(money.amount);
};

/**
 * Round a number to a given precision.
 * @param	 {string} number Number with decimals to round.
 * @param	 {number} precision Number of decimals to round amount to.
 * @return {number} Rounded number.
 */
export const round = function (number, precision) {
	const fixed = Number(Math.round(number + 'e' + precision) + 'e-' + precision).toFixed(precision);
	return parseFloat(fixed);
};

/**
* Compare amounts.
* @param {object} amount1 Amount 1.
* @param {object} amount2 Amount 2.
* @param {number} precision Decimal precision, defaults to 2 decimals.
* @returns {boolean} Whether the amounts are equal regarding amount to the specified precision and the currency.
*/
export const amountEquals = function (amount1, amount2, precision = 2) {
	return isAmount(amount1) && isAmount(amount2) &&
		round(amount1.amount, precision) === round(amount2.amount, precision) &&
		amount1.currency === amount2.currency;
};
