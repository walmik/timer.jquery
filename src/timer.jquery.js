/*global define:false */
/*
 * =======================
 * jQuery Timer Plugin
 * =======================
 * Start/Stop/Resume a time in any HTML element
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(root.jQuery);
	}
}(this, function($) {
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
      startTimer: function() {},
      pauseTimer: function() {},
      resumeTimer: function() {},
      resetTimer: function() {},
      removeTimer: function() {},
			repeat: false,								// this will repeat callback every n times duration is elapsed
			countdown: false,							// if true, this will render the timer as a countdown if duration > 0
			format: null,								// this sets the format in which the time will be printed
			updateFrequency: 1000						// How often should timer display update (default 500ms)
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
	function startTimerInterval(element) {
		$(element).data('intr', setInterval(incrementSeconds.bind(element), options.updateFrequency));
		$(element).data('isTimerRunning', true);
	}

	/**
	 * Common function to stop timer interval
	 */
	function stopTimerInterval(element) {
		clearInterval($(element).data('intr'));
		$(element).data('isTimerRunning', false);
	}

	/**
	 * Increment total seconds by subtracting startTime from the current unix timestamp in seconds
	 * and call render to display pretty time
	 */
	function incrementSeconds() {
		$(this).data('totalSeconds', getUnixSeconds() - $(this).data('startTime'));
		render(this);

		// Check if totalSeconds is equal to duration if any
		if ($(this).data('duration') && $(this).data('totalSeconds') % $(this).data('duration') === 0) {
			// Run the default callback
			options.callback();

			// If 'repeat' is not requested then disable the duration
			if (!options.repeat) {
				$(this).data('duration', null);
        options.duration = null;
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
	function render(element) {
		var sec = $(element).data('totalSeconds');

		if (options.countdown && $(element).data('duration') > 0) {
			sec = $(element).data('duration') - $(element).data('totalSeconds');
		}

		$(element)[display](secondsToTime(sec));
		$(element).data('seconds', sec);
	}

	/**
	 * Method to make timer field editable
	 * This method hard binds focus & blur events to pause & resume
	 * and recognizes built-in pretty time (for eg 12 sec OR 3:34 min)
	 * It won't recognize user created formats.
	 * Users may not always want this hard bound. In such a case,
	 * do not use the editable property. Instead bind custom functions
	 * to blur and focus.
	 */
	function makeEditable(element) {
		$(element).on('focus', function() {
			pauseTimer(element);
		});

		$(element).on('blur', function() {
			// eg. 12 sec 3:34 min 12:30 min
			var val = $(element)[display](), valArr;

			if (val.indexOf('sec') > 0) {
				// sec
				$(element).data('totalSeconds', Number(val.replace(/\ssec/g, '')));
			} else if (val.indexOf('min') > 0) {
				// min
				val = val.replace(/\smin/g, '');
				valArr = val.split(':');
				$(element).data('totalSeconds', Number(valArr[0] * 60) + Number(valArr[1]));
			} else if (val.match(/\d{1,2}:\d{2}:\d{2}/)) {
				// hrs
				valArr = val.split(':');
				$(element).data('totalSeconds', Number(valArr[0] * 3600) + Number(valArr[1] * 60) + Number(valArr[2]));
			}

			resumeTimer(element);
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
	function startTimer(element) {
		if (!$(element).data('isTimerRunning')) {
			render(element);
			startTimerInterval(element);
			$(element).data('state', TIMER_RUNNING);
      options.startTimer($(element));
		}
	}

	function pauseTimer(element) {
		if ($(element).data('isTimerRunning')) {
			stopTimerInterval(element);
			$(element).data('state', TIMER_PAUSED);
      options.pauseTimer($(element));
		}
	}

	function resumeTimer(element) {
		if (!$(element).data('isTimerRunning')) {
			$(element).data('startTime', getUnixSeconds() - $(element).data('totalSeconds'));
			startTimerInterval(element);
			$(element).data('state', TIMER_RUNNING);
      options.resumeTimer($(element));
		}
	}

	function resetTimer(element) {
    options.resetTimer($(element));
		$(element).data('startTime', getUnixSeconds());
		$(element).data('totalSeconds', 0);
		$(element).data('seconds', $(element).data('totalSeconds'));
		$(element).data('state', TIMER_STOPPED);
		$(element).data('duration', options.duration);
	}

	function removeTimer(element) {
		stopTimerInterval(element);
    options.removeTimer($(element));
		$(element).data('plugin_' + pluginName, null);
		$(element).data('seconds', null);
		$(element).data('state', null);
		$(element)[display]('');
	}

	// TIMER PROTOTYPE
	var Timer = function(element, userOptions) {
		var elementType;

		this.options = options = $.extend(options, userOptions);
    this.element = element;

		// Setup total seconds from options.seconds (if any)
		$(element).data('totalSeconds', options.seconds);

		// Setup start time if seconds were provided
		$(element).data('startTime', getUnixSeconds() - $(element).data('totalSeconds'));

		$(element).data('seconds', $(element).data('totalSeconds'));
		$(element).data('state', TIMER_STOPPED);

		// Check if this is a input/textarea element or not
		elementType = $(element).prop('tagName').toLowerCase();
		if (elementType === 'input' || elementType === 'textarea') {
			display = 'val';
		}

		if (options.duration) {
			$(element).data('duration', timeToSeconds(options.duration));
      options.duration = timeToSeconds(options.duration);
		}

		if (options.editable) {
			makeEditable(element);
		}

	};

	/**
	 * Initialize the plugin with public methods
	 */
	Timer.prototype = {
		start: function() {
			startTimer(this.element);
		},

		pause: function() {
			pauseTimer(this.element);
		},

		resume: function() {
			resumeTimer(this.element);
		},

		reset: function() {
			resetTimer(this.element);
		},

		remove: function() {
			removeTimer(this.element);
		}
	};

	// INITIALIZE THE PLUGIN
	var pluginName = 'timer';
	$.fn[pluginName] = function(options) {
		options = options || 'start';

		return this.each(function() {
			/**
			 * Allow the plugin to be initialized on an element only once
			 * This way we can call the plugin's internal function
			 * without having to reinitialize the plugin all over again.
			 */
			if (!($.data(this, 'plugin_' + pluginName) instanceof Timer)) {

				/**
				 * Create a new data attribute on the element to hold the plugin name
				 * This way we can know which plugin(s) is/are initialized on the element later
				 */
				$.data(this, 'plugin_' + pluginName, new Timer(this, options));

			}

			/**
			 * Use the instance of this plugin derived from the data attribute for this element
			 * to conduct whatever action requested as a string parameter.
			 */
			var instance = $.data(this, 'plugin_' + pluginName);

			/**
			 * Provision for calling a function from this plugin
			 * without initializing it all over again
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
        if (options.state == TIMER_RUNNING) {
  				instance.start.call(instance);
        }
        else {
          render(this);
        }
			}
		});
	};

}));
