/*global Cosmoz, accounting */
if (typeof Cosmoz === 'undefined') {
	var Cosmoz = {};
}

(function () {

	'use strict';

	var formats = {
		EUR: {
			currency: {
				symbol: '€',   // default currency symbol is '$'
				format: '%s %v', // controls output: %s = symbol, %v = value/number (can be object: see below)
				decimal: ',',  // decimal point separator
				thousand: '.',  // thousands separator
				precision: 2   // decimal places
			},
			number: {
				precision: 0,  // default precision on numbers is 0
				thousand: ',',
				decimal: '.'
			}
		},
		SEK: {
			currency: {
				symbol: 'kr',   // default currency symbol is '$'
				format: '%v %s', // controls output: %s = symbol, %v = value/number (can be object: see below)
				decimal: ',',  // decimal point separator
				thousand: ' ',  // thousands separator
				precision: 2   // decimal places
			},
			number: {
				precision: 0,  // default precision on numbers is 0
				thousand: ',',
				decimal: '.'
			}
		},
		NOK: {
			currency: {
				symbol: 'kr',   // default currency symbol is '$'
				format: '%v %s', // controls output: %s = symbol, %v = value/number (can be object: see below)
				decimal: ',',  // decimal point separator
				thousand: ' ',  // thousands separator
				precision: 2   // decimal places
			},
			number: {
				precision: 0,  // default precision on numbers is 0
				thousand: ',',
				decimal: '.'
			}
		},
		USD: {
			currency: {
				symbol : '$',   // default currency symbol is '$'
				format: '%s %v', // controls output: %s = symbol, %v = value/number (can be object: see below)
				decimal : '.',  // decimal point separator
				thousand: ',',  // thousands separator
				precision : 2   // decimal places
			},
			number: {
				precision : 0,  // default precision on numbers is 0
				thousand: ',',
				decimal : '.'
			}
		}
	};

	/** @polymerBehavior */
	Cosmoz.MoneyHelperBehavior = {
		renderAmount: function (money) {
			var format = this._renderFormat(money);
			return accounting.formatMoney(money.amount, format.currency);
		},
		renderMoney: function (money) {
			return this.renderAmount(money);
		},
		renderNumberAmount: function (money) {
			var format = this._renderFormat(money);
			return accounting.formatNumber(money.amount, format.currency);
		},
		unformatRenderedAmount: function (amountString, decimalSeparator) {
			return accounting.unformat(amountString, decimalSeparator === ',' ? ',' : '');
		},
		round: function (number, precision) {
			return parseFloat(accounting.toFixed(number, precision));
		},
		_renderFormat: function (money) {
			if (money === undefined) {
				return;
			}
			if (money.amount === undefined || money.currency === undefined) {
				return (money.amount === undefined
					? ''
					: money.amount) + ' ' + (money.currency === undefined
					? ''
					: money.currency);
			}
			var format = formats[money.currency];
			if (!format) {
				return money.amount + ' ' + money.currency;
			}
			return format;
		}
	};
}());