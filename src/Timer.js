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
			config.duration = utils.durationTimeToSeconds(config.duration);
		}
		this.config = Object.assign(this.config, config);
		if (this.config.seconds) {
			this.totalSeconds = this.config.seconds;
		}

		if (this.config.editable) {
			this.makeEditable();
		}
	}

	start() {
		if (this.state !== TIMER_RUNNING) {
			this.startTime = utils.unixSeconds() - this.totalSeconds;
			this.state = TIMER_RUNNING;
			this.render();
			this.intervalId = setInterval(this.intervalHandler.bind(this), this.config.updateFrequency);
		}
	}

	pause() {
		if (this.state === TIMER_RUNNING) {
			this.state = TIMER_PAUSED;
			clearInterval(this.intervalId);
		}
	}

	resume() {
		if (this.state === TIMER_PAUSED) {
			this.state = TIMER_RUNNING;
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
		$(this.element).data('seconds', this.totalSeconds);
	}

	intervalHandler() {
		this.totalSeconds = utils.unixSeconds() - this.startTime;
		this.render();
	}

	makeEditable() {
		$(this.element).on('focus', () => {
			this.pause();
		});

		$(this.element).on('blur', () => {
			this.totalSeconds = utils.prettyTimeToSeconds($(this.element)[this.html]());
			this.resume();
		});
	}
}

export default Timer;
