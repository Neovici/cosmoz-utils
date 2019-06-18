import moment from 'moment';

/**
 * Format a date as an ISO-date - YYYY-MM-DD.
 * @param	 {date/string} date Date to be ISO formatted.
 * @return {string} ISO formatted date.
 */
export const isoDate = function (date) {
	const time = date && moment(date);
	return time && time.isValid() && time.format('YYYY-MM-DD') || '';
};

/**
 * Format a date with time as an ISO date with time - YYYY-MM-DD HH:mm:ss.
 * @param	 {date/string} date Date to be ISO formatted.
 * @return {string} ISO formatted date.
 */
export const isoDT = function (date) {
	const time = date && moment(date);
	return time && time.isValid() && time.format('YYYY-MM-DD HH:mm:ss') || '';
};

/**
 * Check if date is in the past.
 * @param	 {date/string} date Date to check.
 * @return {boolean} Whether the date is in the past or not.
 */
export const pastDate = function (date) {
	const time = date && moment(date);
	return time && time.isValid() && time.isBefore(new Date());

};

/**
 * Get human readable string describing date's difference from now in the current locale language.
 * @param	 {date/string} date Date to check.
 * @return {string}		Date representation string in the current locale language.
 */
export const timeago = function (date) {
	const time = date && moment(date);
	return time && time.isValid() && time.fromNow() || '';
};

/**
 * Alias for isoDate(date), format a date as an ISO-date - YYYY-MM-DD.
 * @param	 {date/string} date Date to be formatted.
 * @return {string} ISO formatted date.
 */
export const renderDate = function (date) {
	return isoDate(date);
};

/**
 * Alias for isoDT(date). Format a date with time as an ISO date with time - YYYY-MM-DD HH:mm:ss.
 * @param	 {date/string} date Date to be ISO formatted.
 * @return {string} ISO formatted date.
 */
export const renderDatetime = function (date) {
	return isoDT(date);
};

/**
 * Validate a Date object or date string.
 * @param	 {date/string} date Date to check.
 * @return {date} Validated date or undefined on failure.
 */
export const ensureDate = function (date) {
	let ensuredDate;
	if (date == null) {
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
	if (ensuredDate instanceof Date && isNaN(ensuredDate)) {
		return;
	}
	return ensuredDate;
};

/**
 * Get difference in days between two date strings.
 * @param	 {date/string} date1 Date to count days from.
 * @param	 {date/string} date2 Date to count days to.
 * @return {string} Date difference in days.
 */
export const dayDiff = function (date1, date2) {
	const time1 = moment(date1),
		time2 = moment(date2);
	if (time1.isValid() && time2.isValid()) {
		return time1.diff(time2, 'days');
	}
	return '';
};
