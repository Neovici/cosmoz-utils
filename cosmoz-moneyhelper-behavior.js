/*global Cosmoz, accounting */
if (typeof Cosmoz === 'undefined') {
	var Cosmoz = {};
}

(function () {

	"use strict";

	var formats = {
		EUR: {
			currency: {
				symbol: "€",   // default currency symbol is '$'
				format: "%s %v", // controls output: %s = symbol, %v = value/number (can be object: see below)
				decimal: ",",  // decimal point separator
				thousand: ".",  // thousands separator
				precision: 2   // decimal places
			},
			number: {
				precision: 0,  // default precision on numbers is 0
				thousand: ",",
				decimal: "."
			}
		},
		SEK: {
			currency: {
				symbol: "kr",   // default currency symbol is '$'
				format: "%v %s", // controls output: %s = symbol, %v = value/number (can be object: see below)
				decimal: ",",  // decimal point separator
				thousand: " ",  // thousands separator
				precision: 2   // decimal places
			},
			number: {
				precision: 0,  // default precision on numbers is 0
				thousand: ",",
				decimal: "."
			}
		},
		NOK: {
			currency: {
				symbol: "kr",   // default currency symbol is '$'
				format: "%v %s", // controls output: %s = symbol, %v = value/number (can be object: see below)
				decimal: ",",  // decimal point separator
				thousand: " ",  // thousands separator
				precision: 2   // decimal places
			},
			number: {
				precision: 0,  // default precision on numbers is 0
				thousand: ",",
				decimal: "."
			}
		}
	};

	/**
	 * @polymerBehavior
	 */
	Cosmoz.MoneyHelperBehavior = {
		renderAmount: function (money) {
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
			return accounting.formatMoney(money.amount, format.currency);
		},
		renderMoney: function (money) {
			return this.renderAmount(money);
		}
	};
}());