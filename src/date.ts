const getValUnitDiff = (
		date1: Date,
		date2: Date
	): [number, Intl.RelativeTimeFormatUnit] => {
		const msDiff = date1.getTime() - date2.getTime(),
			secDiff = msDiff / 1000,
			minDiff = secDiff / 60,
			hourDiff = minDiff / 60,
			dayDiff = hourDiff / 24,
			monthDiff = dayDiff / 30,
			yearDiff = monthDiff / 12;
		if (Math.abs(yearDiff) >= 1) {
			return [yearDiff, 'year'];
		}
		if (Math.abs(monthDiff) >= 1) {
			return [monthDiff, 'month'];
		}
		if (Math.abs(dayDiff) >= 1) {
			return [dayDiff, 'day'];
		}
		if (Math.abs(hourDiff) >= 1) {
			return [hourDiff, 'hour'];
		}
		if (Math.abs(minDiff) >= 1) {
			return [minDiff, 'minute'];
		}
		return [secDiff, 'second'];
	},
	rules = { isoBasic: /^\d{4}-\d{2}-\d{2}$/iu },
	parse = <T extends number | string>(val: T) => {
		if (typeof val === 'string' && rules.isoBasic.test(val)) {
			return new Date(`${val}T00:00`);
		}
		return new Date(val);
	},
	/**
	 * Validate a Date object or date string.
	 * @param {date/string} date Date to check.
	 * @return {date} Validated date or undefined on failure.
	 */
	ensureDate = <T>(date: T) => {
		if (date == null) {
			return;
		}
		if (date instanceof Date && !isNaN(date.getTime())) {
			return date;
		}
		if (!(typeof date === 'number' || typeof date === 'string')) {
			return;
		}

		const ensuredDate = parse(date);

		if (ensuredDate instanceof Date && isNaN(ensuredDate.getTime())) {
			return;
		}
		return ensuredDate;
	},
	/**
	 * Format a date as an ISO-date - YYYY-MM-DD.
	 * @param {date/string} date Date to be ISO formatted.
	 * @return {string} ISO formatted date.
	 */
	isoDate = <T>(date: T) => {
		const d = ensureDate(date);
		if (d == null) {
			return '';
		}
		// Sweden uses ISO8601 human-readable
		return d.toLocaleDateString('sv', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		});
	},
	/**
	 * Format a date with time as an ISO date with time - YYYY-MM-DD HH:mm:ss.
	 * @param	 {date/string} date Date to be ISO formatted.
	 * @return {string} ISO formatted date.
	 */
	isoDT = <T>(date: T) => {
		const d = ensureDate(date);
		if (d == null) {
			return '';
		}
		// Sweden uses ISO8601 human-readable
		return d.toLocaleDateString('sv', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			hourCycle: 'h23'
		});
	},
	/**
	 * Check if date is in the past.
	 * @param	 {date/string} date Date to check.
	 * @return {boolean} Whether the date is in the past or not.
	 */
	pastDate = <T>(date: T) => {
		const d = ensureDate(date);
		if (d == null) {
			return;
		}
		return d.getTime() < Date.now();
	},
	/**
	 * Get human readable string describing date's difference from now in the current locale language.
	 * @param {date/string} date Date to check.
	 * @param {string} locale Localized lang to return string in (undefined = browser)
	 * @return {string}		Date representation string in the current locale language.
	 */
	timeago = <T>(date: T, locale?: string) => {
		const d = ensureDate(date);
		if (d == null) {
			return '';
		}
		return new Intl.RelativeTimeFormat(locale, {
			localeMatcher: 'best fit', // other values: "lookup"
			numeric: 'auto', // other values: "auto"
			style: 'long', // other values: "short" or "narrow"
		}).format(...getValUnitDiff(d, new Date()));
	},
	/**
	 * Alias for isoDate(date), format a date as an ISO-date - YYYY-MM-DD.
	 * @param	 {date/string} date Date to be formatted.
	 * @return {string} ISO formatted date.
	 */
	renderDate = isoDate,
	pad = (number: number) => (number < 10 ? '0' + number : number),
	toLocalISOString = <T>(date: T) => {
		if (!(date instanceof Date)) {
			return null;
		}
		return (
			date.getFullYear() +
			'-' +
			pad(date.getMonth() + 1) +
			'-' +
			pad(date.getDate()) +
			'T' +
			pad(date.getHours()) +
			':' +
			pad(date.getMinutes()) +
			':' +
			pad(date.getSeconds()) +
			'.' +
			(date.getMilliseconds() / 1000).toFixed(3).slice(2, 5)
		);
	},
	parseDate = (str: string) => {
		const ts = Date.parse(str);
		if (isNaN(ts)) {
			return;
		}
		return new Date(ts);
	},
	inputDate = <T>(date: T) => {
		const d = ensureDate(date);
		if (d == null) {
			return;
		}
		return (
			d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
		);
	};

export {
	ensureDate,
	isoDate,
	isoDT,
	pad,
	pastDate,
	renderDate,
	toLocalISOString,
	timeago,
	parseDate,
	inputDate,
};
