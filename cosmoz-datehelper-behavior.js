/*global Cosmoz, moment */

if (typeof Cosmoz === 'undefined') {
	var Cosmoz = {};
}

(function () {

	'use strict';

	/**
	 * @polymerBehavior
	 */
	Cosmoz.DateHelperBehavior = {
		isoDate: function (date) {
			date = this.ensureDate(date);
			if (!date) {
				return '';
			}
			return moment(date).format('YYYY-MM-DD');
		},
		isoDT: function (date) {
			date = this.ensureDate(date);
			if (!date) {
				return '';
			}
			return moment(date).format('YYYY-MM-DD HH:mm:ss');
		},
		/**
		 * Check if date is in the past
		 * @param  {date/string} date Date to check
		 * @return {boolean}      In the past?
		 */
		pastDate: function (date) {
			date = this.ensureDate(date);
			if (!date) {
				return '';
			}
			if (date > new Date()) {
				return false;
			}
			return true;
		},
		/**
		 * Get human readable string describing date's difference from now
		 * @param  {date} date Date to check
		 * @return {String}   Date representation string
		 */
		timeago: function (date) {
			date = this.ensureDate(date);
			if (!date) {
				return '';
			}
			return moment(date).fromNow();
		},
		renderDate: function (date) {
			return this.isoDate(date);
		},
		renderDatetime: function (date) {
			return this.isoDT(date);
		},
		ensureDate: function (date) {
			if (date === undefined) {
				return;
			}
			if (date instanceof Date) {
				return date;
			}
			try {
				date = new Date(date);
			} catch (err) {
				return;
			}
			return date;
		},
		dayDiff: function (date1, date2) {
			date1 = this.ensureDate(date1);
			date2 = this.ensureDate(date2);
			return Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
		}
	};

}());