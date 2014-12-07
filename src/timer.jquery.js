/*
 * =======================
 * jQuery Timer Plugin
 * =======================
 * 
 * Depends on:		jquery
 * 
 * ------------
 * Description:
 * ------------
 * Start/Stop/Resume a time in any HTML element
 */

(function($){
	//////////////////////PRIVATE//////////////////////
	var intr,
		totalSeconds = 0,
		isTimerRunning = false,
		startTime,
		duration = null,
		options = {
			seconds: 0,									//default seconds value to start timer from
			editable: true,								//this will let users make changes to the time
			restart: false,								//this will enable stop or continue after a timer callback
			duration: null,								//duration to run callback after
			//callback to run after elapsed duration
			callback: function() { 
				alert('Time up!');
				stopTimerInterval();
			},	
			repeat: false								//this will repeat callback every n times duration is elapsed
		},
		$el,
		display = 'html';	//to be used as $el.html in case of div and $el.val in case of input type text

	/**
	 * Common function to start or resume a timer interval
	 */
	function startTimerInterval() {
		intr = setInterval(incrementSeconds, 500);
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

		//check if totalSeconds is equal to duration if any
		if(duration && totalSeconds === duration) {
			options.callback();
			if(options.repeat) {
				//reset duration
				duration += options.duration;
			}
		}
	}

	/**
	 * Render pretty time
	 */
	function render() {
		$el[display](secondsToTime(totalSeconds));
		$el.data('seconds', totalSeconds);
	}

	/**
	 * Remove timer object and data from element
	 */
	function removeTimer() {
		stopTimerInterval();
		$el.data('plugin_' + pluginName, null);
		$el.data('seconds', null);
		$el[display]('');
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

		//hours
		if(sec >= 3600) hours = Math.floor(sec / 3600);

		//minutes
		if(sec >= 3600) {
			minutes = Math.floor(sec % 3600 / 60);
		}
		//prepend 0 to minutes under 10
		if(minutes < 10 && hours > 0) {
			minutes = '0' + minutes;
		}
		
		//seconds
		seconds = sec % 60;
		//prepend 0 to seconds under 10
		if(seconds < 10 && (minutes > 0 || hours > 0)) {
			seconds = '0' + seconds;
		}

		return {
			hours: hours,
			minutes: minutes,
			seconds: seconds
		}
	}

	/**
	 * Convert the given seconds to an object made up of hours, minutes and seconds and return a pretty display
	 * @param  {Number} sec [Second to display as pretty time]
	 * @return {String}     [Pretty time]
	 */
	function secondsToTime(sec) {
		var time = '',
			timeObj = sec2TimeObj(sec);

		//time
		if(timeObj.hours) {
			time = timeObj.hours + ':' + timeObj.minutes + ':' + timeObj.seconds;
		} else {
			if(timeObj.minutes ) {
				time = timeObj.minutes + ':' + timeObj.seconds + ' min';
			} else {
				time = timeObj.seconds + ' sec';
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
		//In case it s just a number, then use that as number of seconds
		if(!isNaN(Number(time))) {
			return time;
		}

		var hMatch = time.match(/\d{1,2}h/), 
			mMatch = time.match(/\d{1,2}m/), 
			sMatch = time.match(/\d{1,2}s/), 
			seconds = 0;

		//convert to lowercase in case of string
		time = time.toLowerCase();

		//@todo: throw an error in case of faulty time value like 5m61s or 61m

		if(hMatch) {
			seconds += Number(hMatch[0].replace('h', '')) * 3600;
		}

		if(mMatch) {
			seconds += Number(mMatch[0].replace('m', '')) * 60;
		}

		if(sMatch) {
			seconds += Number(sMatch[0].replace('s', ''));
		}

		return seconds;
	}


	//////////////////TIMER PROTOTYPE//////////////////
	var Timer = function(element, userOptions) {
		var elementType;

		options = $.extend(options, userOptions);
		$el = $(element);

		//setup
		totalSeconds = options.seconds;
		$el.data('seconds', totalSeconds);
		
		//check if this is a input/textarea element or not
		elementType = $el.prop('tagName').toLowerCase();
		if(elementType === 'input' || elementType === 'textarea') {
			display = 'val';
		}

		if(options.duration) {
			duration = options.duration = timeToSeconds(options.duration);
		}

	};

	/**
	 * Initialize the plugin with public methods
	 */
	Timer.prototype = {
		start: function() {
			if(!isTimerRunning) {
				startTime = getUnixSeconds();
				render();
				startTimerInterval();
			}
		},

		pause: function() {
			console.log('pause');
			if(isTimerRunning) {
				stopTimerInterval();
			}
		},

		resume: function() {
			if(!isTimerRunning) {
				startTime = getUnixSeconds() - totalSeconds;
				startTimerInterval();
			}
		},

		remove: function() {
			removeTimer();
		}
	};

	///////////////INITIALIZE THE PLUGIN///////////////
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
			 * Provision for passing an object for notification feature
			 */
			if( typeof options === 'object' ) {
				instance['start'].call(instance, options);
			}
		});
	};

})(jQuery);