export interface Amount {
	amount: number;
	currency: string;
}

const CURRENCY_FORMATTERS: Record<string, Intl.NumberFormat> = {},
	NUMBER_FORMATTERS: Record<string, Intl.NumberFormat> = {},
	_getCurrencyFormatter = function (
		currency: string,
		locale?: string,
		currencyDisplay = 'code',
	) {
		if (currency == null) {
			return;
		}
		const key = currency.toUpperCase() + (locale || '');
		if (CURRENCY_FORMATTERS[key] == null) {
			try {
				CURRENCY_FORMATTERS[key] = new Intl.NumberFormat(locale, {
					style: 'currency',
					currency,
					currencyDisplay,
				});
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error('Invalid format', e);
				return;
			}
		}
		return CURRENCY_FORMATTERS[key];
	},
	/**
	 * Determine if a constant or a variable is an amount.
	 * @param {object} potentialAmount Potential amount.
	 * @returns {boolean} Whether the potential amount is a valid amount object with amount and currency.
	 */
	isAmount = (potentialAmount: unknown): potentialAmount is Amount =>
		potentialAmount != null &&
		typeof potentialAmount === 'object' &&
		typeof (potentialAmount as { amount: unknown }).amount === 'number' &&
		typeof (potentialAmount as { currency: unknown }).currency === 'string' &&
		(potentialAmount as { currency: string }).currency.length === 3,
	/**
	 * Render an amount with decimal separator and currency symbol.
	 * @param	 {object} money Money with amount property and optionally currency property.
	 * @param	{void|string} locale Locale to format the amount in.
	 * @return {string} Formatted amount.
	 */
	renderAmount = (money: Amount | null, locale?: string) => {
		if (money?.amount == null) {
			return;
		}
		const formatter = _getCurrencyFormatter(money.currency, locale);
		if (formatter == null) {
			return;
		}
		return formatter.format(money.amount);
	},
	/**
	 * Alias for renderAmount(money). Render an amount with decimal separator and currency symbol.
	 * @param	 {object} money Money with amount property and optionally currency property.
	 * @return {string} Formatted amount.
	 */
	renderMoney = renderAmount,
	/**
	 * Render an amount with decimal separator but without currency symbol.
	 * @param	 {object} money Money with amount property and optionally currency property.
	 * @param	{void|string} locale Locale to format the amount in.
	 * @return {string} Formatted number.
	 */
	renderNumberAmount = (money: Amount, locale?: string) => {
		const key = locale || '0';
		if (NUMBER_FORMATTERS[key] == null) {
			NUMBER_FORMATTERS[key] = new Intl.NumberFormat(locale, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		}
		return NUMBER_FORMATTERS[key].format(money.amount);
	},
	/**
	 * Round a number to a given precision.
	 * @param	 {string} number Number with decimals to round.
	 * @param	 {number} precision Number of decimals to round amount to.
	 * @return {number} Rounded number.
	 */
	round = (number: number | string, precision: number) => {
		const fixed = Number(
			Math.round(Number(number + 'e' + precision)) + 'e-' + precision,
		).toFixed(precision);
		return parseFloat(fixed);
	},
	/**
	 * Compare amounts.
	 * @param {object} amount1 Amount 1.
	 * @param {object} amount2 Amount 2.
	 * @param {number} precision Decimal precision, defaults to 2 decimals.
	 * @returns {boolean} Whether the amounts are equal regarding amount to the specified precision and the currency.
	 */
	amountEquals = <T1, T2>(amount1: T1, amount2: T2, precision = 2) => {
		return (
			isAmount(amount1) &&
			isAmount(amount2) &&
			round(amount1.amount, precision) === round(amount2.amount, precision) &&
			amount1.currency === amount2.currency
		);
	};

export {
	isAmount,
	renderAmount,
	renderMoney,
	renderNumberAmount,
	round,
	amountEquals,
};
