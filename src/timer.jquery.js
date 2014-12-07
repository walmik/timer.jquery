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
		//console.log('incrementSeconds', totalSeconds);
		render();
	}

	/**
	 * Render pretty time
	 */
	function render() {
		$el[display](secondsToTime(totalSeconds));
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


	//////////////////TIMER PROTOTYPE//////////////////
	var Timer = function(element, options) {
		var elementType, 
			defaults = {
				seconds: 0,				//default seconds value to start timer from
				editable: true,			//this will let users make changes to the time
				restart: false,			//this will enable stop or continue after a timer callback
				repeat: false			//this will enable us to repeat the callback passed by user
			};

		this.options = $.extend(defaults, options);
		$el = $(element);

		this.element = element;	//to remove the Timer object on remove
		
		//check if this is a input/textarea element or not
		elementType = $el.prop('tagName').toLowerCase();
		if(elementType === 'input' || elementType === 'textarea') {
			display = 'val';
		}
	};

	/**
	 * Initialize the plugin with public methods
	 */
	Timer.prototype = {
		start: function() {
			if(!isTimerRunning) {
				startTime = getUnixSeconds();
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
	////////////////////////////////////////////////////
	////////////////////////////////////////////////////



})(jQuery);