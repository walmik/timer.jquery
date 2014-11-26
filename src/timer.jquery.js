/*
 * =======================
 * jQuery Timer Plugin
 * =======================
 * 
 * Depends on:		jquery
 * 
 * --------
 * Summary:
 * --------
 * Start/Stop/Resume a time in any HTML element
 */

(function($){

	var Timer = function(element, options) {
		var defaults = {
			seconds: 0,				//default seconds value to start timer from
			editable: true,			//this will let users make changes to the time
			restart: false,			//this will enable stop or continue after a timer callback
			repeat: false			//this will enable us to repeat the callback passed by user
		};

		this.options = $.extend(defaults, options);
		this.$el = $(element);
		this.element = element;	//to remove the Timer object on remove

		this.init();

	};

	/**
	 * Initialize the plugin with common properties
	 */
	Timer.prototype.init = function() {

		//Setup
		this.initSecs 		   = this.options.seconds;
		this.secsNum           = 0;
		this.minsNum           = 0;
		this.hrsNum            = 0;
		this.secsStr           = '0';
		this.minsStr           = '';
		this.hrsStr            = '';
		this.timerId           = null;
		this.delay             = 1000;
		this.isTimerRunning    = false;

		//Initial time display
		this.hrsNum = Math.floor(this.options.seconds / 3600);
		this.minsNum = Math.floor((this.options.seconds - (this.hrsNum * 3600))/60);
		this.secsNum = this.options.seconds - (this.hrsNum * 3600) - (this.minsNum * 60);
		this.timeToString();
		
		this.elType = this.$el.prop('tagName').toLowerCase();

		if(this.options.editable) {
			this.initEditable();
		}

		/**
		 * Convert the duration to seconds (for notifications)
		 */
		if(this.options.duration) {
			this.duration = this.options.duration = this.convertToSeconds(this.options.duration); //duration increments by options.duration over time
		}

	};

	Timer.prototype.convertToSeconds = function(time) {
		//the duration can be a number or string
		//eg. 5m OR 5m30s or 2h15m30s OR 15
		
		//In case it s just a number, then use that as number of seconds
		if(!isNaN(Number(time))) {
			return time;
		}

		time = time.toLowerCase();

		//@todo: throw an error in case of faulty time value like 5m61s or 61m

		//Convert pretty time to seconds
		var seconds = 0;

		time.replace(/((\d{1,2}h)|(\d{1,2}m)|(\d{1,2}s))/, function($match, $1, $2, $3, $4){
			if($2) seconds += Number($2.replace('h', '')) * 3600;
			if($3) seconds += Number($3.replace('m', '')) * 60;
			if($4) seconds += Number($4.replace('s', ''));
		});

		return seconds;
	};

	Timer.prototype.start = function () {	
		if(!this.isTimerRunning) {
			this.updateTimerDisplay();
			//initialize seconds
			this.initSecs = Math.round(new Date().getTime() / 1000) - 1 - this.secsNum;
			this.incrementTime();
			this.startTimerInterval();
			this.updateTimerDisplay();
		}
	};

	Timer.prototype.pause = function () {
		clearInterval(this.timerId);
		this.isTimerRunning = false;
	};

	Timer.prototype.resume = function () {
		if(!this.isTimerRunning) {
			this.initSecs = Math.round(new Date().getTime() / 1000) - this.secsNum;
			this.startTimerInterval();
		}
	};

	Timer.prototype.remove = function () {
		this.pause();
		//clear timeout
		clearTimeout(this.timeOutId);

		//Remove data attributes
		this.$el.data('plugin_' + pluginName, null);
		this.$el.data('seconds', null);
	};


	Timer.prototype.startTimerInterval = function () {
		var self = this;
		this.timerId = setInterval(function() { self.incrementTime() }, this.delay);
		this.isTimerRunning = true;	
	};

	/*
	Allow users to click and edit the timer value by typing in
	*/
	Timer.prototype.initEditable = function () {
		
		var self = this;

		this.$el.on('focus', function(){
			self.pause();
		});

		this.$el.on('blur', function(){

			//get the value and update the number of seconds if necessary
			var timerDisplayStr, timerDisplayArr;

			//remove any spaces while getting the string
			if(self.elType === 'input' || self.elType === 'textarea') {
				timerDisplayStr = $(this).val().replace(/\s+/, '');
			} else {
				timerDisplayStr = $(this).html().replace(/\s+/, '');
			}

			//check for seconds
			//check for minutes
			//check for hours

			var matchSeconds  = /\d+sec/,
			matchMinutes  = /\d+\:\d+min/,
			matchHours    = /\d+\:\d+\:\d+/;

			if(timerDisplayStr.match(matchSeconds)) {

				//extract the seconds from this
				self.secsNum = parseInt(timerDisplayStr.replace(/sec/, ''), 10) + 1;
				if (self.secsNum > 59) {
					self.adjustSeconds();
				}

			} else if(timerDisplayStr.match(matchMinutes)) {
				timerDisplayStr = timerDisplayStr.replace(/min/, '');
				timerDisplayArr = timerDisplayStr.split(':');
				self.minsNum = parseInt(timerDisplayArr[0], 10);
				self.secsNum = parseInt(timerDisplayArr[1], 10) + 1;

				if (self.secsNum > 59) {
					self.adjustSeconds();
				}

				if (self.minsNum > 59) {
					self.adjustMinutes();
				}

			} else if(timerDisplayStr.match(matchHours)) {

				//adjust hours
				timerDisplayArr = timerDisplayStr.split(':');
				self.hrsNum = parseInt(timerDisplayArr[0], 10);
				self.minsNum = parseInt(timerDisplayArr[1], 10);
				self.secsNum = parseInt(timerDisplayArr[2], 10) + 1;

				if (self.secsNum > 59) {
					self.adjustSeconds();
				}

				if (self.minsNum > 59) {
					self.adjustMinutes();
				}

			}
			//Update initSecs
			self.initSecs = Math.round(new Date().getTime() / 1000) - self.secsNum;

			//resume timer
			self.resume();
		});
	};

	/**
	 * Function to adjust time in case seconds are more than 60
	 */
	Timer.prototype.adjustSeconds = function() {
		//get the number of minutes
		var minutes = Math.floor(this.secsNum / 60);
		this.minsNum += minutes;
		//get the number of seconds that remain
		this.secsNum = this.secsNum - (minutes * 60);
	}

	Timer.prototype.adjustMinutes = function () {
		//get the number of hours
		var hours = Math.floor(this.minsNum / 60);
		this.hrsNum += hours;
		//get the number of minutes that remain
		this.minsNum = this.minsNum - (hours * 60);
	}

	Timer.prototype.updateTimerDisplay = function () {

		var displayStr;

		if(this.hrsNum === 0) {
			if(this.secsNum < 60 && this.minsNum === 0) {
				displayStr = this.secsStr + ' sec';
			} else {
				displayStr = this.minsStr + ':' + this.secsStr + ' min';
			}
		} else {
			displayStr = this.hrsStr + ':' + this.minsStr + ':' + this.secsStr;
		}

		if(this.elType === 'input' || this.elType === 'textarea') {
			this.$el.val(displayStr);
		} else {
			this.$el.html(displayStr);
		}

		//assign the number of seconds to this element's data attribute for seconds
		this.$el.data('seconds', this.get_seconds());
	};

	Timer.prototype.timeToString = function () {
		this.secsStr = ((this.minsNum > 0 || this.hrsNum > 0) && this.secsNum < 10) ?  '0' + this.secsNum : this.secsNum;
		this.minsStr = (this.hrsNum > 0 && this.minsNum < 10) ?  '0' + this.minsNum : this.minsNum;
		this.hrsStr = this.hrsNum;
	};

	/*
	Get the timer's value in seconds
	*/
	Timer.prototype.get_seconds = function () {
		return ((this.hrsNum*3600) + (this.minsNum*60) + this.secsNum);
	};

	/**
	 * Notify - Call callback function if any when the options.duration is complete
	 */
	Timer.prototype.notify = function() {
		//If user has specified a callback, then use that or just alert a simple 'Time up!' message.
		if(this.options.callback) {
			this.options.callback();
		} else {
			alert('Time up!');
		}
		
	};

	Timer.prototype.incrementTime = function () {

		this.timeToString();
		this.updateTimerDisplay();

		/**
		 * Check if a duration was specified 
		 * If so pass control over to `notify` for a moment
		 */	
		if(this.$el.data('seconds') === this.duration) {
			this.notify();
			if(this.options.repeat === true) {
				this.duration += this.options.duration;
			}
		}

		//get the difference in seconds from current moment and initSecs
		var diff = Math.round(new Date().getTime() / 1000)  - this.initSecs;
		this.secsNum = diff;

		if(this.secsNum % 60 === 0) {
			this.minsNum++;
			this.secsNum = 0;
			this.initSecs = Math.round(new Date().getTime() / 1000);
		}

		//handle time exceeding 60 minsNum!
		if(this.minsNum > 59 && this.minsNum % 60 === 0) {
			this.hrsNum++;
			this.minsNum = 0;
		}

	};




	///////////////////////////////////////////////////
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