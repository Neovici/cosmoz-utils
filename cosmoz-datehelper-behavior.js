/*global Cosmoz, moment */
(function () {

	'use strict';
	window.Cosmoz = window.Cosmoz || {};

	/** @polymerBehavior */
	Cosmoz.DateHelperBehavior = {

		isoDate: function (date) {
			var ensuredDate = this.ensureDate(date);
			if (!ensuredDate) {
				return '';
			}
			return moment(ensuredDate).format('YYYY-MM-DD');
		},

		isoDT: function (date) {
			var ensuredDate = this.ensureDate(date);
			if (!ensuredDate) {
				return '';
			}
			return moment(ensuredDate).format('YYYY-MM-DD HH:mm:ss');
		},

		/**
		 * Check if date is in the past
		 * @param  {date/string} date Date to check
		 * @return {boolean}      In the past?
		 */
		pastDate: function (date) {
			var ensuredDate = this.ensureDate(date);
			if (!ensuredDate) {
				return '';
			}
			if (ensuredDate > new Date()) {
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
			var ensuredDate = this.ensureDate(date);
			if (!ensuredDate) {
				return '';
			}
			return moment(ensuredDate).fromNow();
		},
		renderDate: function (date) {
			return this.isoDate(date);
		},
		renderDatetime: function (date) {
			return this.isoDT(date);
		},
		ensureDate: function (date) {
			var ensuredDate;
			if (date === undefined) {
				return;
			}
			if (date instanceof Date) {
				return date;
			}
			try {
				ensuredDate = new Date(date);
			} catch (err) {
				return;
			}
			return ensuredDate;
		},
		dayDiff: function (date1, date2) {
			var ensuredDate1 = this.ensureDate(date1)
				, ensuredDate2 = this.ensureDate(date2);
			return Math.round((ensuredDate1 - ensuredDate2) / (1000 * 60 * 60 * 24));
		}
	};

}());
