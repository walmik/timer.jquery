/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Timer = __webpack_require__(1);

	var _Timer2 = _interopRequireDefault(_Timer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(function () {
		$.fn.timer = function (options) {
			options = options || 'start';

			return this.each(function () {
				if (!($.data(this, 'timer') instanceof _Timer2.default)) {
					/**
	     * Create a new data attribute on the element to hold the plugin name
	     * This way we can know which plugin(s) is/are initialized on the element later
	     */
					$.data(this, 'timer', new _Timer2.default(this, options));
				}

				/**
	    * Use the instance of this plugin derived from the data attribute for this element
	    * to conduct whatever action requested as a string parameter.
	    */
				var instance = $.data(this, 'timer');

				/**
	    * Provision for calling a function from this plugin
	    * without initializing it all over again
	    */
				if (typeof options === 'string') {
					if (typeof instance[options] === 'function') {
						/*
	     Pass in 'instance' to provide for the value of 'this' in the called function
	     */
						instance[options]();
					}
				} else {
					instance.start();
				}
			});
		};
	})(); /* global $:true */
	/* eslint no-undef: "error" */

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global $:true */

	var _utils = __webpack_require__(2);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var PLUGIN_NAME = 'plugin_timer';
	var TIMER_STOPPED = 'stopped';
	var TIMER_RUNNING = 'running';
	var TIMER_PAUSED = 'paused';
	var getDefaultConfig = function getDefaultConfig() {
		return {
			seconds: 0, // Default seconds value to start timer from
			editable: false, // Allow making changes to the time by clicking on it
			restart: false, // This will enable stop OR continue after the set duration & callback
			duration: null, // Duration to run callback after
			callback: function callback() {
				// Default callback to run after elapsed duration
				console.log('Time up!');
			},
			repeat: false, // this will repeat callback every n times duration is elapsed
			countdown: false, // if true, this will render the timer as a countdown (must have duration)
			format: null, // this sets the format in which the time will be printed
			updateFrequency: 500 // How often should timer display update
		};
	};

	/**
	 * Timer class to be instantiated on every element.
	 * All relative values will be stored at instance level.
	 */

	var Timer = function () {
		/**
	  * Construct a Timer instance on the provided element with the given config.
	  * @param  {Object} element HTML node as passed by jQuery
	  * @param  {Object|String} config User extended options or a string (start, pause, resume etc)
	  */

		function Timer(element, config) {
			_classCallCheck(this, Timer);

			this.element = element;
			this.totalSeconds = 0;
			this.state = TIMER_STOPPED;
			this.intervalId = null;
			// A HTML element will have the html() method in jQuery to inject content,
			this.html = 'html';
			if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
				// In case of input element or a textarea, jQuery provides the val() method to inject content
				this.html = 'val';
			}

			this.config = getDefaultConfig();

			if (!config || typeof config === 'string') {
				return;
			}

			if (config.duration) {
				config.duration = _utils2.default.durationTimeToSeconds(config.duration);
			}
			this.config = Object.assign(this.config, config);
			if (this.config.seconds) {
				this.totalSeconds = this.config.seconds;
			}

			if (this.config.editable) {
				this.makeEditable();
			}
		}

		_createClass(Timer, [{
			key: 'start',
			value: function start() {
				if (this.state !== TIMER_RUNNING) {
					this.startTime = _utils2.default.unixSeconds() - this.totalSeconds;
					this.state = TIMER_RUNNING;
					this.render();
					this.intervalId = setInterval(this.intervalHandler.bind(this), this.config.updateFrequency);
				}
			}
		}, {
			key: 'pause',
			value: function pause() {
				if (this.state === TIMER_RUNNING) {
					this.state = TIMER_PAUSED;
					clearInterval(this.intervalId);
				}
			}
		}, {
			key: 'resume',
			value: function resume() {
				if (this.state === TIMER_PAUSED) {
					this.state = TIMER_RUNNING;
					this.startTime = _utils2.default.unixSeconds() - this.totalSeconds;
					this.intervalId = setInterval(this.intervalHandler.bind(this), this.config.updateFrequency);
				}
			}
		}, {
			key: 'remove',
			value: function remove() {
				clearInterval(this.intervalId);
				this.element.dataset[PLUGIN_NAME] = null;
			}
		}, {
			key: 'render',
			value: function render() {
				if (this.config.format) {
					$(this.element)[this.html](_utils2.default.secondsToFormattedTime(this.totalSeconds, this.config.format));
				} else {
					$(this.element)[this.html](_utils2.default.secondsToPrettyTime(this.totalSeconds));
				}
			}
		}, {
			key: 'intervalHandler',
			value: function intervalHandler() {
				this.totalSeconds = _utils2.default.unixSeconds() - this.startTime;
				this.render();
			}
		}, {
			key: 'makeEditable',
			value: function makeEditable() {
				var _this = this;

				$(this.element).on('focus', function () {
					_this.pause();
				});

				$(this.element).on('blur', function () {
					_this.totalSeconds = _utils2.default.prettyTimeToSeconds($(_this.element)[_this.html]());
					_this.resume();
				});
			}
		}]);

		return Timer;
	}();

	exports.default = Timer;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var THIRTYSIXHUNDRED = 3600;
	var SIXTY = 60;
	var TEN = 10;

	/**
	 * Convert (a number) seconds to a Object with hours, minutes etc as properties
	 * Used by secondsToPrettyTime for to format the time display
	 * @param  {Number} totalSeconds The total seconds that needs to be distributed into an Object
	 * @return {Object} Object with hours, minutes, totalMinutes, seconds and totalSeconds
	 */
	var secondsToTimeObj = function secondsToTimeObj() {
		var totalSeconds = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

		var hours = 0;
		var totalMinutes = Math.floor(totalSeconds / SIXTY);
		var minutes = totalMinutes;
		var seconds = void 0;

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

		return { hours: hours, minutes: minutes, totalMinutes: totalMinutes, seconds: seconds, totalSeconds: totalSeconds };
	};

	var paddedValue = function paddedValue(val) {
		val = parseInt(val, 10);
		if (val < 10) {
			return '0' + val;
		}
		return val;
	};

	exports.default = {
		/**
	  * @return {Number} Return seconds passed since Jan 1, 1970
	  */
		unixSeconds: function unixSeconds() {
			return Math.round(Date.now() / 1000);
		},

		/**
	  * Convert seconds to pretty time.
	  * For example 100 becomes 1:40 min, 34 becomes 34 sec and 10000 becomes 2:46:40
	  * @param  {Number} seconds Seconds to be converted
	  * @return {String}         Pretty time
	  */
		secondsToPrettyTime: function secondsToPrettyTime(seconds) {
			var timeObj = secondsToTimeObj(seconds);
			if (timeObj.hours) {
				return timeObj.hours + ':' + timeObj.minutes + ':' + timeObj.seconds;
			}

			var prettyTime = '';
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
		secondsToFormattedTime: function secondsToFormattedTime(seconds, formattedTime) {
			var timeObj = secondsToTimeObj(seconds);
			var formatDef = [{ identifier: '%h', value: timeObj.hours }, { identifier: '%m', value: timeObj.minutes }, { identifier: '%s', value: timeObj.seconds }, { identifier: '%g', value: timeObj.totalMinutes }, { identifier: '%t', value: timeObj.totalSeconds }, { identifier: '%H', value: paddedValue(timeObj.hours) }, { identifier: '%M', value: paddedValue(timeObj.minutes) }, { identifier: '%S', value: paddedValue(timeObj.seconds) }, { identifier: '%G', value: paddedValue(timeObj.totalMinutes) }, { identifier: '%T', value: paddedValue(timeObj.totalSeconds) }];
			formatDef.forEach(function (fmt) {
				formattedTime = formattedTime.replace(fmt.identifier, fmt.value);
			});

			return formattedTime;
		},

		/**
	  * Convert duration time format to seconds
	  * @param  {String} timeFormat e.g. 5m30s
	  * @return {Number} Returns 330
	  */
		durationTimeToSeconds: function durationTimeToSeconds(timeFormat) {
			if (!timeFormat) {
				throw new Error('durationTimeToSeconds expects a string argument!');
			}

			// Early return in case a number is passed
			if (!isNaN(Number(timeFormat))) {
				return timeFormat;
			}

			timeFormat = timeFormat.toLowerCase();
			var hrs = timeFormat.match(/\d{1,2}h/); // Match 5h in 5h30m10s
			var mins = timeFormat.match(/\d{1,2}m/); // Match 30m in 5h30m10s
			var secs = timeFormat.match(/\d{1,2}s/); // Match 10s in 5h30m10s

			if (!hrs && !mins && !secs) {
				throw new Error('Invalid string passed in durationTimeToSeconds!');
			}
			var seconds = 0;

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
		prettyTimeToSeconds: function prettyTimeToSeconds(editedTime) {
			var arr = void 0;
			var parsedTime = void 0;

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

/***/ }
/******/ ]);