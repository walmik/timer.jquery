/*global jQuery:false */
/*
 * =======================
 * jQuery Timer Plugin
 * =======================
 * Start/Stop/Resume a time in any HTML element
 */

(function($) {
	// PRIVATE
	var intr,
		totalSeconds = 0,
		isTimerRunning = false,
		startTime,
		duration = null,
		options = {
			seconds: 0,									// default seconds value to start timer from
			editable: false,							// this will let users make changes to the time
			restart: false,								// this will enable stop or continue after a timer callback
			duration: null,								// duration to run callback after
			// callback to run after elapsed duration
			callback: function() {
				alert('Time up!');
				stopTimerInterval();
			},
			repeat: false,								// this will repeat callback every n times duration is elapsed
			countdown: false,							// if true, this will render the timer as a countdown if duration > 0
			format: null,								// this sets the format in which the time will be printed
			updateFrequency: 500						// How often should timer display update (default 500ms)
		},
		$el,
		display = 'html',	// to be used as $el.html in case of div and $el.val in case of input type text
		// Constants for various states of the timer
		TIMER_STOPPED = 'stopped',
		TIMER_RUNNING = 'running',
		TIMER_PAUSED = 'paused';

	/**
	 * Common function to start or resume a timer interval
	 */
	function startTimerInterval() {
		intr = setInterval(incrementSeconds, options.updateFrequency);
		isTimerRunning = true;
	}

	/**
	 * Common function to stop timer interval
	 * @return {[type]} [description]
	 */
	function stopTimerInterval() {
		clearInterval(intr);
		isTimerRunning = false;
	}

	/**
	 * Increment total seconds by subtracting startTime from the current unix timestamp in seconds
	 * and call render to display pretty time
	 */
	function incrementSeconds() {
		totalSeconds = getUnixSeconds() - startTime;
		render();

		// Check if totalSeconds is equal to duration if any
		if (duration && totalSeconds === duration) {
			// Run the default callback
			options.callback();

			// If repeat is requested, bump the duration by options.duration
			if (options.repeat) {
				duration += options.duration;
			}

			// If this is a countdown, then end it as duration has completed
			if (options.countdown) {
				options.countdown = false;
			}
		}
	}

	/**
	 * Render pretty time
	 */
	function render() {
		var sec = totalSeconds;

		if (options.countdown && duration > 0) {
			sec = duration - totalSeconds;
		}

		$el[display](secondsToTime(sec));
		$el.data('seconds', sec);
	}

	function makeEditable() {
		$el.on('focus', function() {
			pauseTimer();
		});

		$el.on('blur', function() {
			// eg. 12 sec 3:34 min 12:30 min
			var val = $el[display](), valArr;

			if (val.indexOf('sec') > 0) {
				// sec
				totalSeconds = Number(val.replace(/\ssec/g, ''));
			} else if (val.indexOf('min') > 0) {
				// min
				val = val.replace(/\smin/g, '');
				valArr = val.split(':');
				totalSeconds = Number(valArr[0] * 60) + Number(valArr[1]);
			} else if (val.match(/\d{1,2}:\d{2}:\d{2}/)) {
				// hrs
				valArr = val.split(':');
				totalSeconds = Number(valArr[0] * 3600) + Number(valArr[1] * 60) + Number(valArr[2]);
			}

			resumeTimer();
		});
	}

	/**
	 * Get the current unix timestamp in seconds
	 * @return {Number} [unix timestamp in seconds]
	 */
	function getUnixSeconds() {
		return Math.round(new Date().getTime() / 1000);
	}

	/**
	 * Convert a number of seconds into an object of hours, minutes and seconds
	 * @param  {Number} sec [Number of seconds]
	 * @return {Object}     [An object with hours, minutes and seconds representation of the given seconds]
	 */
	function sec2TimeObj(sec) {
		var hours = 0, minutes = Math.floor(sec / 60), seconds;

		// Hours
		if (sec >= 3600) {
			hours = Math.floor(sec / 3600);
		}

		// Minutes
		if (sec >= 3600) {
			minutes = Math.floor(sec % 3600 / 60);
		}
		// Prepend 0 to minutes under 10
		if (minutes < 10 && hours > 0) {
			minutes = '0' + minutes;
		}
		// Seconds
		seconds = sec % 60;
		// Prepend 0 to seconds under 10
		if (seconds < 10 && (minutes > 0 || hours > 0)) {
			seconds = '0' + seconds;
		}

		return {
			hours: hours,
			minutes: minutes,
			seconds: seconds
		};
	}

	/**
	 * Convert the given seconds to an object made up of hours, minutes and seconds and return a pretty display
	 * @param  {Number} sec [Second to display as pretty time]
	 * @return {String}     [Pretty time]
	 */
	function secondsToTime(sec) {
		var time = '',
			timeObj = sec2TimeObj(sec);

		if (options.format) {
			var formatDef = [
				{identifier: '%h', value: timeObj.hours, pad: false},
				{identifier: '%m', value: timeObj.minutes, pad: false},
				{identifier: '%s', value: timeObj.seconds, pad: false},
				{identifier: '%H', value: parseInt(timeObj.hours), pad: true},
				{identifier: '%M', value: parseInt(timeObj.minutes), pad: true},
				{identifier: '%S', value: parseInt(timeObj.seconds), pad: true}
			];
			time = options.format;

			formatDef.forEach(function(format) {
				time = time.replace(
					new RegExp(format.identifier.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'),
					(format.pad) ? ((format.value < 10) ? '0' + format.value : format.value) : format.value
				);
			});
		} else {
			if (timeObj.hours) {
				time = timeObj.hours + ':' + timeObj.minutes + ':' + timeObj.seconds;
			} else {
				if (timeObj.minutes) {
					time = timeObj.minutes + ':' + timeObj.seconds + ' min';
				} else {
					time = timeObj.seconds + ' sec';
				}
			}
		}
		return time;
	}

	/**
	 * Convert a string time like 5m30s to seconds
	 * If a number (eg 300) is provided, then return as is
	 * @param  {Number|String} time [The human time to convert to seconds]
	 * @return {Number}      [Number of seconds]
	 */
	function timeToSeconds(time) {
		// In case the passed arg is a number, then use that as number of seconds
		if (!isNaN(Number(time))) {
			return time;
		}

		var hMatch = time.match(/\d{1,2}h/),
			mMatch = time.match(/\d{1,2}m/),
			sMatch = time.match(/\d{1,2}s/),
			seconds = 0;

		time = time.toLowerCase();

		// @todo: throw an error in case of faulty time value like 5m61s or 61m

		if (hMatch) {
			seconds += Number(hMatch[0].replace('h', '')) * 3600;
		}

		if (mMatch) {
			seconds += Number(mMatch[0].replace('m', '')) * 60;
		}

		if (sMatch) {
			seconds += Number(sMatch[0].replace('s', ''));
		}

		return seconds;
	}

	// TIMER INTERFACE
	function startTimer() {
		if (!isTimerRunning) {
			render();
			startTimerInterval();
			$el.data('state', TIMER_RUNNING);
		}
	}

	function pauseTimer() {
		if (isTimerRunning) {
			stopTimerInterval();
			$el.data('state', TIMER_PAUSED);
		}
	}

	function resumeTimer() {
		if (!isTimerRunning) {
			startTime = getUnixSeconds() - totalSeconds;
			startTimerInterval();
			$el.data('state', TIMER_RUNNING);
		}
	}

	function resetTimer() {
		startTime = getUnixSeconds();
		totalSeconds = 0;
		$el.data('seconds', totalSeconds);
		$el.data('state', TIMER_STOPPED);
		duration = options.duration;
	}

	function removeTimer() {
		stopTimerInterval();
		$el.data('plugin_' + pluginName, null);
		$el.data('seconds', null);
		$el.data('state', null);
		$el[display]('');
	}

	// TIMER PROTOTYPE
	var Timer = function(element, userOptions) {
		var elementType;

		options = $.extend(options, userOptions);
		$el = $(element);

		// Setup total seconds from options.seconds (if any)
		totalSeconds = options.seconds;

		// Setup start time if seconds were provided
		startTime = getUnixSeconds() - totalSeconds;

		$el.data('seconds', totalSeconds);
		$el.data('state', TIMER_STOPPED);

		// Check if this is a input/textarea element or not
		elementType = $el.prop('tagName').toLowerCase();
		if (elementType === 'input' || elementType === 'textarea') {
			display = 'val';
		}

		if (options.duration) {
			duration = options.duration = timeToSeconds(options.duration);
			// If duration is less than the totalSeconds,
			// then the callback if any will not be called
			if (totalSeconds >= duration) {
				duration = totalSeconds + duration;
			}
		}

		if (options.editable) {
			makeEditable();
		}

	};

	/**
	 * Initialize the plugin with public methods
	 */
	Timer.prototype = {
		start: function() {
			startTimer();
		},

		pause: function() {
			pauseTimer();
		},

		resume: function() {
			resumeTimer();
		},

		reset: function() {
			resetTimer();
		},

		remove: function() {
			removeTimer();
		}
	};

	// INITIALIZE THE PLUGIN
	var pluginName = 'timer';
	$.fn[pluginName] = function(options) {
		options = options || 'start';

		return this.each(function() {
			/*
			Allow the plugin to be initialized on an element only once
			This way we can call the plugin's internal function
			without having to reinitialize the plugin all over again.
			*/
			if (!($.data(this, 'plugin_' + pluginName) instanceof Timer)) {

				/*
				Create a new data attribute on the element to hold the plugin name
				This way we can know which plugin(s) is/are initialized on the element later
				*/
				$.data(this, 'plugin_' + pluginName, new Timer(this, options));

			}

			/*
			Use the instance of this plugin derived from the data attribute for this element
			to conduct whatever action requested as a string parameter.
			*/
			var instance = $.data(this, 'plugin_' + pluginName);

			/*
			Provision for calling a function from this plugin
			without initializing it all over again
			*/
			if (typeof options === 'string') {
				if (typeof instance[options] === 'function') {
					/*
					Pass in 'instance' to provide for the value of 'this' in the called function
					*/
					instance[options].call(instance);
				}
			}

			/**
			 * Allow passing custom options object
			 */
			if (typeof options === 'object') {
				instance.start.call(instance);
			}
		});
	};

})(jQuery);
