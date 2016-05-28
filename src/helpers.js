const THIRTYSIXHUNDRED = 3600;
const SIXTY = 60;
const TEN = 10;
const Helpers = {
	/**
	 * Return seconds passed since Jan 1, 1970
	 * @return {Number}
	 */
	unixSeconds: () => (Math.round(Date.now() / 1000)),

	secondsToPrettyTime: () => {

	},

	/**
	 * Convert (a number) seconds to a time object with hours, minutes, total minutes and seconds.
	 * Used by secondsToPrettyTime for to format the time display
	 * @param  {Number}
	 * @return {Object}
	 */
	secondsToTimeObj: (totalSeconds = 0) => {
		let hours = 0;
		let totalMinutes = Math.floor(totalSeconds / SIXTY);
		let minutes = totalMinutes;
		let seconds;

		// Hours
		if (totalSeconds >= THIRTYSIXHUNDRED) {
			hours = Math.floor(totalSeconds / THIRTYSIXHUNDRED);
		}

		// Minutes
		if (totalSeconds >= THIRTYSIXHUNDRED) {
			minutes = Math.floor(totalSeconds % THIRTYSIXHUNDRED / SIXTY);
		}
		// Prepend 0 to minutes under TEN
		if (minutes < TEN && hours > 0) {
			minutes = '0' + minutes;
		}
		// Seconds
		seconds = totalSeconds % SIXTY;
		// Prepend 0 to seconds under TEN
		if (seconds < TEN && (minutes > 0 || hours > 0)) {
			seconds = '0' + seconds;
		}

		return {hours, minutes, totalMinutes, seconds, totalSeconds};
	},

	/**
	 * Convert a shorthand time format like `5m30s` to seconds 330
	 * @param  {String}
	 * @return {Number}
	 */
	timeFormatToSeconds: (timeFormat) => {
		if (!timeFormat) {
			throw new Error('timeFormatToSeconds expects a string argument!');
			return;
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
			throw new Error('Invalid string passed in timeFormatToSeconds!');
			return;
		}
		let seconds = 0;

		if (hrs) {
			seconds += Number(hrs[0].replace('h', '') * THIRTYSIXHUNDRED)
		}

		if (mins) {
			seconds += Number(mins[0].replace('m', '')) * SIXTY;
		}

		if (secs) {
			seconds += Number(secs[0].replace('s', ''));
		}

		return seconds;
	}
	
};

export default Helpers;