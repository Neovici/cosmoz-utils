/*global Cosmoz, moment */

(function () {

	"use strict";

	/**
	 * @polymerBehavior
	 */
	Cosmoz.DateHelperBehavior = {
		isoDate: function (date) {
			if (date === undefined) {
				return "";
			}
			return moment(date).format("YYYY-MM-DD");
		},
		isoDT: function (date) {
			if (date === undefined) {
				return "";
			}
			return moment(date).format("YYYY-MM-DD HH:mm:ss");
		},
		/**
		 * Check if date is in the past
		 * @param  {date/string} date Date to check
		 * @return {boolean}      In the past?
		 */
		pastDate: function (date) {
			if (date === undefined) {
				return false;
			}
			try {
				date = new Date(date);
			} catch (err) {
				return false;
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
			if (date === undefined) {
				return "";
			}

			return moment(date).fromNow();
		},
		renderDate: function (date) {
			return this.isoDate(date);
		},
		renderDatetime: function (date) {
			return this.isoDT(date);
		}
	};

	Cosmoz.CommonBehaviors.push(Cosmoz.DateHelperBehavior);
}());