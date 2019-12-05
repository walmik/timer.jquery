/* global Constants:true */
/**
 * Private
 * Convert (a number) seconds to a Object with days, hours, minutes etc as properties
 * Used by secondsToPrettyTime for to format the time display
 * @param  {Number} totalSeconds The total seconds that needs to be distributed into an Object
 * @return {Object} Object with days, hours, minutes, totalMinutes, seconds and totalSeconds
 */
function _secondsToTimeObj(totalSeconds) {
	var totalMinutes;
	totalSeconds = totalSeconds || 0;
	totalMinutes = Math.floor(totalSeconds / 60);
	return {
		days: totalSeconds >= Constants.DAYINSECONDS ?
			Math.floor(totalSeconds / Constants.DAYINSECONDS) :
			0,
		hours: totalSeconds >= 3600 ?
			Math.floor(totalSeconds % Constants.DAYINSECONDS / 3600) :
			0,
		totalMinutes: totalMinutes,
		minutes: totalSeconds >= 60 ?
			Math.floor(totalSeconds % 3600 / 60) :
			totalMinutes,
		seconds: totalSeconds % 60,
		totalSeconds: totalSeconds
	};
}

/**
 * Private
 * Method to pad a given number with a 0 in case it's less than 10
 * @param  {Number} num The number to be padded
 * @return {String|Number} Padded (if less than 10) number
 */
function _paddedValue(num) {
	num = parseInt(num, 10);
	return (num < 10 && '0') + num;
}

/**
 * Method to return the base settings that can be used in case of no or missing options
 * @return {Object} Default config
 */
function getDefaultConfig() {
	return {
		seconds: 0,					// Default seconds value to start timer from
		editable: false,			// Allow making changes to the time by clicking on it
		duration: null,				// Duration to run callback after
		callback: function() {		// Default callback to run after elapsed duration
			console.log('Time up!');
		},
		repeat: false,				// This will repeat callback every n times duration is elapsed
		countdown: false,			// If true, this will render the timer as a countdown (must have duration)
		format: null,				// This sets the format in which the time will be printed
		updateFrequency: 500		// How often should timer display update
	};
}

/**
 * @return {Number} Return seconds passed since Jan 1, 1970
 */
function unixSeconds() {
	return Math.round((Date.now ? Date.now() : new Date().getTime()) / 1000);
}

/**
 * Convert seconds to pretty time.
 * For example 100 becomes 1:40 min, 34 becomes 34 sec and 10000 becomes 2:46:40
 * @param  {Number} seconds Seconds to be converted
 * @return {String}         Pretty time
 */
function secondsToPrettyTime(seconds) {
	var timeObj = _secondsToTimeObj(seconds);

	if (timeObj.days) {
		return timeObj.days + ':' + _paddedValue(timeObj.hours) + ':' +
			_paddedValue(timeObj.minutes) + ':' + _paddedValue(timeObj.seconds);
	}

	if (timeObj.hours) {
		return timeObj.hours +
			':' + _paddedValue(timeObj.minutes) +
			':' + _paddedValue(timeObj.seconds);
	}

	var prettyTime = '';
	if (timeObj.minutes) {
		prettyTime = timeObj.minutes + ':' + _paddedValue(timeObj.seconds) + ' min';
	} else {
		prettyTime = timeObj.seconds + ' sec';
	}

	return prettyTime;
}

/**
 * Convert seconds to user defined format for time
 * @param  {Number} seconds       Seconds to be converted
 * @param  {String} formattedTime User defined format
 * @return {String}               Formatted time string
 */
function secondsToFormattedTime(seconds, formattedTime) {
	var timeObj = _secondsToTimeObj(seconds);
	var formatDef = [
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

	// Use `for` loop to support ie8 after transpilation
	for (var i = 0; i < formatDef.length; i++) {
		formattedTime = formattedTime.replace(formatDef[i].identifier, formatDef[i].value);
	}

	return formattedTime;
}

/**
 * Convert duration time format to seconds
 * @param  {String} timeFormat e.g. 5m30s
 * @return {Number} Returns 330
 */
function durationTimeToSeconds(timeFormat) {
	if (!isNaN(Number(timeFormat))) {
		return timeFormat; // A number was passed
	}

	timeFormat = timeFormat.toLowerCase();
	var days = timeFormat.match(/\d+d/);		// Match 10d in 10d5h30m10s
	var hrs = timeFormat.match(/\d+h/);			// Match 5h in 5h30m10s
	var mins = timeFormat.match(/\d+m/);		// Match 30m in 5h30m10s
	var secs = timeFormat.match(/\d+s/);		// Match 10s in 5h30m10s

	if (!days && !hrs && !mins && !secs) {
		throw new Error('Invalid string passed in durationTimeToSeconds!');
	}

	var seconds = 0;
	if (days) {
		seconds += Number(days[0].replace('d', '')) * Constants.DAYINSECONDS;
	}

	if (hrs) {
		seconds += Number(hrs[0].replace('h', '')) * 3600;
	}

	if (mins) {
		seconds += Number(mins[0].replace('m', '')) * 60;
	}

	if (secs) {
		seconds += Number(secs[0].replace('s', ''));
	}
	return seconds;
}

/**
 * Parse pretty time and return it as seconds
 * Currently only the native pretty time is parseable
 * @param  {String} editedTime The time as edited by the user
 * @return {Number}            Parsed time
 */
function prettyTimeToSeconds(editedTime) {
	var arr, time;

	if (editedTime.indexOf('sec') > 0) {
		time = Number(editedTime.replace(/\ssec/g, ''));
	} else if (editedTime.indexOf('min') > 0) {
		editedTime = editedTime.replace(/\smin/g, '');
		arr = editedTime.split(':');
		time = Number(arr[0] * 60) + Number(arr[1]);
	} else if (editedTime.match(/\d{1,2}:\d{2}:\d{2}:\d{2}/)) {
		arr = editedTime.split(':');
		time = Number(arr[0] * Constants.DAYINSECONDS) + Number(arr[1] * 3600) +
			Number(arr[2] * 60) + Number(arr[3]);
	} else if (editedTime.match(/\d{1,2}:\d{2}:\d{2}/)) {
		arr = editedTime.split(':');
		time = Number(arr[0] * 3600) + Number(arr[1] * 60) + Number(arr[2]);
	}

	return time;
}

/**
 * Set the provided state of the timer in the data attr `state` of the timer HTML element
 * @param  {Object} timerInstance Instance of the timer object
 * @param  {[type]} newState      The state to be set on the HTML element
 */
function setState(timerInstance, newState) {
	timerInstance.state = newState;
	$(timerInstance.element).data('state', newState);
}

/**
 * Convenience method to wire up focus & blur events to pause and resume
 * Makes use of the local `prettyTimeToSeconds` function to convert user edited time to seconds
 * @param  {Object} timerInstance Instance of the Timer Class
 */
function makeEditable(timerInstance) {
	$(timerInstance.element).on('focus', function() {
		timerInstance.pause();
	});

	$(timerInstance.element).on('blur', function() {
		timerInstance.totalSeconds = prettyTimeToSeconds(
			$(timerInstance.element)[timerInstance.html]()
		);
		timerInstance.resume();
	});
}

/**
 * The function that will be called via setInterval based on the timer's update frequency
 * @param  {Object} timerInstance Instance of the timer object
 */
function intervalHandler(timerInstance) {
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
	if (timerInstance.totalSeconds > 0 &&
		timerInstance.totalSeconds % timerInstance.config.duration === 0) {
		if (timerInstance.config.callback) {
			timerInstance.config.callback();
		}

		if (!timerInstance.config.repeat) {
			clearInterval(timerInstance.intervalId);
			setState(timerInstance, Constants.TIMER_STOPPED);
			timerInstance.config.duration = null;
		}
	}
}

var utils = {
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
