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
		renderDate: function (date) {
			return this.isoDate(date);
		},
		renderDatetime: function (date) {
			console.log('renderDatetime');
			return this.isoDT(date);
		}
	};

	Cosmoz.CommonBehaviors.push(Cosmoz.DateHelperBehavior);
}());