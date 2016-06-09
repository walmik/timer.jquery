/* global $:true */
import Constants from './constants';
/**
 * Private
 * Convert (a number) seconds to a Object with days, hours, minutes etc as properties
 * Used by secondsToPrettyTime for to format the time display
 * @param  {Number} totalSeconds The total seconds that needs to be distributed into an Object
 * @return {Object} Object with days, hours, minutes, totalMinutes, seconds and totalSeconds
 */
const _secondsToTimeObj = (totalSeconds = 0) => {
	let days = 0;
	let hours = 0;
	let totalMinutes = Math.floor(totalSeconds / Constants.SIXTY);
	let minutes = totalMinutes;
	let seconds;

	if (totalSeconds >= Constants.DAYINSECONDS) {
		days = Math.floor(totalSeconds / Constants.DAYINSECONDS);
	}

	if (totalSeconds >= Constants.THIRTYSIXHUNDRED) {
		hours = Math.floor(totalSeconds % Constants.DAYINSECONDS / Constants.THIRTYSIXHUNDRED);
	}

	if (totalSeconds >= Constants.SIXTY) {
		minutes = Math.floor(totalSeconds % Constants.THIRTYSIXHUNDRED / Constants.SIXTY);
	}

	seconds = totalSeconds % Constants.SIXTY;

	return {days, hours, minutes, totalMinutes, seconds, totalSeconds};
};

/**
 * Private
 * Method to pad a given number with a 0 in case it's less than 10
 * @param  {Number} num The number to be padded
 * @return {String|Number} Padded (if less than 10) number
 */
const _paddedValue = num => {
	num = parseInt(num, 10);
	if (num < 10) {
		return '0' + num;
	}
	return num;
};

const getDefaultConfig = () => ({
	seconds: 0,					// Default seconds value to start timer from
	editable: false,			// Allow making changes to the time by clicking on it
	duration: null,				// Duration to run callback after
	callback: function() {		// Default callback to run after elapsed duration
		console.log('Time up!');
	},
	repeat: false,				// this will repeat callback every n times duration is elapsed
	countdown: false,			// if true, this will render the timer as a countdown (must have duration)
	format: null,				// this sets the format in which the time will be printed
	updateFrequency: 500		// How often should timer display update
});

/**
 * @return {Number} Return seconds passed since Jan 1, 1970
 */
const unixSeconds = () => (Math.round(Date.now() / 1000));

/**
 * Convert seconds to pretty time.
 * For example 100 becomes 1:40 min, 34 becomes 34 sec and 10000 becomes 2:46:40
 * @param  {Number} seconds Seconds to be converted
 * @return {String}         Pretty time
 */
const secondsToPrettyTime = seconds => {
	let timeObj = _secondsToTimeObj(seconds);

	if (timeObj.days) {
		return timeObj.days + ':' + _paddedValue(timeObj.hours) + ':' +
			_paddedValue(timeObj.minutes) + ':' + _paddedValue(timeObj.seconds);
	}

	if (timeObj.hours) {
		return timeObj.hours + ':' + _paddedValue(timeObj.minutes) + ':' + _paddedValue(timeObj.seconds);
	}

	let prettyTime = '';
	if (timeObj.minutes) {
		prettyTime = timeObj.minutes + ':' + _paddedValue(timeObj.seconds) + ' min';
	} else {
		prettyTime = timeObj.seconds + ' sec';
	}

	return prettyTime;
};

/**
 * Convert seconds to user defined format for time
 * @param  {Number} seconds       Seconds to be converted
 * @param  {String} formattedTime User defined format
 * @return {String}               Formatted time string
 */
const secondsToFormattedTime = (seconds, formattedTime) => {
	let timeObj = _secondsToTimeObj(seconds);
	const formatDef = [
		{identifier: '%d', value: timeObj.days},
		{identifier: '%h', value: timeObj.hours},
		{identifier: '%m', value: timeObj.minutes},
		{identifier: '%s', value: timeObj.seconds},
		{identifier: '%g', value: timeObj.totalMinutes},
		{identifier: '%t', value: timeObj.totalSeconds},
		{identifier: '%D', value: _paddedValue(timeObj.days)},
		{identifier: '%H', value: _paddedValue(timeObj.hours)},
		{identifier: '%M', value: _paddedValue(timeObj.minutes)},
		{identifier: '%S', value: _paddedValue(timeObj.seconds)},
		{identifier: '%G', value: _paddedValue(timeObj.totalMinutes)},
		{identifier: '%T', value: _paddedValue(timeObj.totalSeconds)}
	];
	formatDef.forEach(function(fmt) {
		formattedTime = formattedTime.replace(fmt.identifier, fmt.value);
	});

	return formattedTime;
};

/**
 * Convert duration time format to seconds
 * @param  {String} timeFormat e.g. 5m30s
 * @return {Number} Returns 330
 */
const durationTimeToSeconds = timeFormat => {
	if (!timeFormat) {
		throw new Error('durationTimeToSeconds expects a string argument!');
	}

	// Early return in case a number is passed
	if (!isNaN(Number(timeFormat))) {
		return timeFormat;
	}

	timeFormat = timeFormat.toLowerCase();
	let days = timeFormat.match(/\d{1,2}d/);	// Match 10d in 10d5h30m10s
	let hrs = timeFormat.match(/\d{1,2}h/);		// Match 5h in 5h30m10s
	let mins = timeFormat.match(/\d{1,2}m/);	// Match 30m in 5h30m10s
	let secs = timeFormat.match(/\d{1,2}s/);	// Match 10s in 5h30m10s

	if (!days && !hrs && !mins && !secs) {
		throw new Error('Invalid string passed in durationTimeToSeconds!');
	}
	let seconds = 0;

	if (days) {
		seconds += Number(days[0].replace('d', '') * Constants.DAYINSECONDS);
	}

	if (hrs) {
		seconds += Number(hrs[0].replace('h', '') * Constants.THIRTYSIXHUNDRED);
	}

	if (mins) {
		seconds += Number(mins[0].replace('m', '')) * Constants.SIXTY;
	}

	if (secs) {
		seconds += Number(secs[0].replace('s', ''));
	}

	return seconds;
};

/**
 * Parse pretty time and return it as seconds
 * Currently only the native pretty time is parseable
 * @param  {String} editedTime The time as edited by the user
 * @return {Number}            Parsed time
 */
const prettyTimeToSeconds = editedTime => {
	let arr;
	let time;

	if (editedTime.indexOf('sec') > 0) {
		time = Number(editedTime.replace(/\ssec/g, ''));
	} else if (editedTime.indexOf('min') > 0) {
		editedTime = editedTime.replace(/\smin/g, '');
		arr = editedTime.split(':');
		time = Number(arr[0] * Constants.SIXTY) + Number(arr[1]);
	} else if (editedTime.match(/\d{1,2}:\d{2}:\d{2}:\d{2}/)) {
		arr = editedTime.split(':');
		time = Number(arr[0] * Constants.DAYINSECONDS) + Number(arr[1] * Constants.THIRTYSIXHUNDRED) +
			Number(arr[2] * Constants.SIXTY) + Number(arr[3]);
	} else if (editedTime.match(/\d{1,2}:\d{2}:\d{2}/)) {
		arr = editedTime.split(':');
		time = Number(arr[0] * Constants.THIRTYSIXHUNDRED) + Number(arr[1] * Constants.SIXTY) + Number(arr[2]);
	}

	return time;
};

/**
 * Set the provided state of the timer in the data attr `state` of the timer HTML element
 * @param  {Object} timerInstance Instance of the timer object
 * @param  {[type]} newState      The state to be set on the HTML element
 */
const setState = (timerInstance, newState) => {
	timerInstance.state = newState;
	$(timerInstance.element).data('state', newState);
};

/**
 * Convenience method to wire up focus & blur events to pause and resume
 * Makes use of the local `prettyTimeToSeconds` function to convert user edited time to seconds
 * @param  {Object} timerInstance Instance of the Timer Class
 */
const makeEditable = timerInstance => {
	$(timerInstance.element).on('focus', () => {
		timerInstance.pause();
	});

	$(timerInstance.element).on('blur', () => {
		timerInstance.totalSeconds = prettyTimeToSeconds($(timerInstance.element)[timerInstance.html]());
		timerInstance.resume();
	});
};

/**
 * The function that will be called via setInterval based on the timer's update frequency
 * @param  {Object} timerInstance Instance of the timer object
 */
const intervalHandler = timerInstance => {
	timerInstance.totalSeconds = unixSeconds() - timerInstance.startTime;

	if (timerInstance.config.countdown) {
		timerInstance.totalSeconds = timerInstance.config.duration - timerInstance.totalSeconds;

		if (timerInstance.totalSeconds === 0) {
			clearInterval(timerInstance.intervalId);
			setState(timerInstance, Constants.TIMER_STOPPED);
			timerInstance.config.callback();
			$(timerInstance.element).data('seconds');
		}

		timerInstance.render();
		return;
	}

	timerInstance.render();
	if (!timerInstance.config.duration) {
		return;
	}

	// If the timer was called with a duration parameter,
	// run the callback if duration is complete
	// and remove the duration if `repeat` is not requested
	if (timerInstance.totalSeconds > 0 && timerInstance.totalSeconds % timerInstance.config.duration === 0) {
		if (timerInstance.config.callback) {
			timerInstance.config.callback();
		}

		if (!timerInstance.config.repeat) {
			clearInterval(timerInstance.intervalId);
			setState(timerInstance, Constants.TIMER_STOPPED);
			timerInstance.config.duration = null;
		}
	}
};

export default {
	getDefaultConfig: getDefaultConfig,
	unixSeconds: unixSeconds,
	secondsToPrettyTime: secondsToPrettyTime,
	secondsToFormattedTime: secondsToFormattedTime,
	durationTimeToSeconds: durationTimeToSeconds,
	prettyTimeToSeconds: prettyTimeToSeconds,
	setState: setState,
	makeEditable: makeEditable,
	intervalHandler: intervalHandler
};
