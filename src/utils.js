const THIRTYSIXHUNDRED = 3600;
const SIXTY = 60;
const TEN = 10;

/**
 * Convert (a number) seconds to a Object with hours, minutes etc as properties
 * Used by secondsToPrettyTime for to format the time display
 * @param  {Number} totalSeconds The total seconds that needs to be distributed into an Object
 * @return {Object} Object with hours, minutes, totalMinutes, seconds and totalSeconds
 */
const secondsToTimeObj = (totalSeconds = 0) => {
	let hours = 0;
	let totalMinutes = Math.floor(totalSeconds / SIXTY);
	let minutes = totalMinutes;
	let seconds;

	if (totalSeconds >= THIRTYSIXHUNDRED) {
		hours = Math.floor(totalSeconds / THIRTYSIXHUNDRED);
	}

	if (totalSeconds >= THIRTYSIXHUNDRED) {
		minutes = Math.floor(totalSeconds % THIRTYSIXHUNDRED / SIXTY);
	}
	if (minutes < TEN && hours > 0) {
		minutes = '0' + minutes;
	}

	seconds = totalSeconds % SIXTY;
	if (seconds < TEN && (minutes > 0 || hours > 0)) {
		seconds = '0' + seconds;
	}

	return {hours, minutes, totalMinutes, seconds, totalSeconds};
};

const paddedValue = val => {
	val = parseInt(val, 10);
	if (val < 10) {
		return '0' + val;
	}
	return val;
};

export default {
	/**
	 * @return {Number} Return seconds passed since Jan 1, 1970
	 */
	unixSeconds: () => (Math.round(Date.now() / 1000)),

	/**
	 * Convert seconds to pretty time.
	 * For example 100 becomes 1:40 min, 34 becomes 34 sec and 10000 becomes 2:46:40
	 * @param  {Number} seconds Seconds to be converted
	 * @return {String}         Pretty time
	 */
	secondsToPrettyTime: seconds => {
		let timeObj = secondsToTimeObj(seconds);
		if (timeObj.hours) {
			return timeObj.hours + ':' + timeObj.minutes + ':' + timeObj.seconds;
		}

		let prettyTime = '';
		if (timeObj.minutes) {
			prettyTime = timeObj.minutes + ':' + timeObj.seconds + ' min';
		} else {
			prettyTime = timeObj.seconds + ' sec';
		}

		return prettyTime;
	},

	/**
	 * Convert seconds to user defined format for time
	 * @param  {Number} seconds       Seconds to be converted
	 * @param  {String} formattedTime User defined format
	 * @return {String}               Formatted time string
	 */
	secondsToFormattedTime: (seconds, formattedTime) => {
		let timeObj = secondsToTimeObj(seconds);
		const formatDef = [
			{identifier: '%h', value: timeObj.hours},
			{identifier: '%m', value: timeObj.minutes},
			{identifier: '%s', value: timeObj.seconds},
			{identifier: '%g', value: timeObj.totalMinutes},
			{identifier: '%t', value: timeObj.totalSeconds},
			{identifier: '%H', value: paddedValue(timeObj.hours)},
			{identifier: '%M', value: paddedValue(timeObj.minutes)},
			{identifier: '%S', value: paddedValue(timeObj.seconds)},
			{identifier: '%G', value: paddedValue(timeObj.totalMinutes)},
			{identifier: '%T', value: paddedValue(timeObj.totalSeconds)}
		];
		formatDef.forEach(function(fmt) {
			formattedTime = formattedTime.replace(fmt.identifier, fmt.value);
		});

		return formattedTime;
	},

	/**
	 * Convert duration time format to seconds
	 * @param  {String} timeFormat e.g. 5m30s
	 * @return {Number} Returns 330
	 */
	durationTimeToSeconds: timeFormat => {
		if (!timeFormat) {
			throw new Error('durationTimeToSeconds expects a string argument!');
		}

		// Early return in case a number is passed
		if (!isNaN(Number(timeFormat))) {
			return timeFormat;
		}

		timeFormat = timeFormat.toLowerCase();
		let hrs = timeFormat.match(/\d{1,2}h/);		// Match 5h in 5h30m10s
		let mins = timeFormat.match(/\d{1,2}m/);	// Match 30m in 5h30m10s
		let secs = timeFormat.match(/\d{1,2}s/);	// Match 10s in 5h30m10s

		if (!hrs && !mins && !secs) {
			throw new Error('Invalid string passed in durationTimeToSeconds!');
		}
		let seconds = 0;

		if (hrs) {
			seconds += Number(hrs[0].replace('h', '') * THIRTYSIXHUNDRED);
		}

		if (mins) {
			seconds += Number(mins[0].replace('m', '')) * SIXTY;
		}

		if (secs) {
			seconds += Number(secs[0].replace('s', ''));
		}

		return seconds;
	},

	/**
	 * Parse pretty time and return it as seconds
	 * Currently only the native pretty time is parseable
	 * @param  {String} editedTime The time as edited by the user
	 * @return {Number}            Parsed time
	 */
	prettyTimeToSeconds: editedTime => {
		let arr;
		let parsedTime;

		if (editedTime.indexOf('sec') > 0) {
			parsedTime = Number(editedTime.replace(/\ssec/g, ''));
		} else if (editedTime.indexOf('min') > 0) {
			editedTime = editedTime.replace(/\smin/g, '');
			arr = editedTime.split(':');
			parsedTime = Number(arr[0] * SIXTY) + Number(arr[1]);
		} else if (editedTime.match(/\d{1,2}:\d{2}:\d{2}/)) {
			arr = editedTime.split(':');
			parsedTime = Number(arr[0] * THIRTYSIXHUNDRED) + Number(arr[1] * SIXTY) + Number(arr[2]);
		}

		return parsedTime;
	}
};
