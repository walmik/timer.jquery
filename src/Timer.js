/* global $:true */

import utils from './utils';

const PLUGIN_NAME = 'timer';
const TIMER_STOPPED = 'stopped';
const TIMER_RUNNING = 'running';
const TIMER_PAUSED = 'paused';
const getDefaultConfig = () => ({
	seconds: 0,					// Default seconds value to start timer from
	editable: false,			// Allow making changes to the time by clicking on it
	restart: false,				// This will enable stop OR continue after the set duration & callback
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
 * Timer class to be instantiated on every element.
 * All relative values will be stored at instance level.
 */
class Timer {
	/**
	 * Construct a Timer instance on the provided element with the given config.
	 * @param  {Object} element HTML node as passed by jQuery
	 * @param  {Object|String} config User extended options or a string (start, pause, resume etc)
	 */
	constructor(element, config) {
		this.element = element;
		this.totalSeconds = 0;
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
			config.duration = utils.durationTimeToSeconds(config.duration);
		}
		this.config = Object.assign(this.config, config);
		if (this.config.seconds) {
			this.totalSeconds = this.config.seconds;
		}

		if (this.config.editable) {
			utils.makeEditable(this);
		}
	}

	start() {
		if (this.state !== TIMER_RUNNING) {
			this.startTime = utils.unixSeconds() - this.totalSeconds;
			utils.setState(this, TIMER_RUNNING);
			this.render();
			this.intervalId = setInterval(this.intervalHandler.bind(this), this.config.updateFrequency);
		}
	}

	pause() {
		if (this.state === TIMER_RUNNING) {
			utils.setState(this, TIMER_PAUSED);
			clearInterval(this.intervalId);
		}
	}

	resume() {
		if (this.state === TIMER_PAUSED) {
			utils.setState(this, TIMER_RUNNING);
			this.startTime = utils.unixSeconds() - this.totalSeconds;
			this.intervalId = setInterval(this.intervalHandler.bind(this), this.config.updateFrequency);
		}
	}

	remove() {
		clearInterval(this.intervalId);
		$(this.element).data(PLUGIN_NAME, null);
	}

	render() {
		if (this.config.format) {
			$(this.element)[this.html](utils.secondsToFormattedTime(this.totalSeconds, this.config.format));
		} else {
			$(this.element)[this.html](utils.secondsToPrettyTime(this.totalSeconds));
		}
		// Make total seconds available via timer element's data attribute
		$(this.element).data('seconds', this.totalSeconds);
	}

	intervalHandler() {
		this.totalSeconds = utils.unixSeconds() - this.startTime;
		this.render();
		if (!this.config.duration) {
			return;
		}

		// If the timer was called with a duration parameter,
		// run the callback if duration is complete
		// and remove the duration if `repeat` is not requested
		if (this.totalSeconds % this.config.duration === 0) {
			if (!this.config.repeat) {
				this.config.duration = null;
			}
		}

		if (this.config.countdown) {
			clearInterval(this.intervalId);
			utils.setState(this, TIMER_STOPPED);
		}

		// Finally invoke callback
		this.config.callback();
	}
}

export default Timer;
