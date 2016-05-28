import utils from './utils';

const TIMER_STOPPED = 'stopped';
// const TIMER_RUNNING = 'running';
// const TIMER_PAUSED = 'paused';
const getDefaultConfig = () => ({
	seconds: 0,					// default seconds value to start timer from
	editable: false,			// this will let users make changes to the time
	startTime: utils.unixSeconds(),
	restart: false,				// this will enable stop or continue after a timer callback
	duration: null,				// duration to run callback after
	// default callback to run after elapsed duration
	callback: function() {
		console.log('Time up!');
	},
	repeat: false,				// this will repeat callback every n times duration is elapsed
	countdown: false,			// if true, this will render the timer as a countdown (must have duration)
	format: null,				// this sets the format in which the time will be printed
	updateFrequency: 1000,		// How often should timer display update (default 500ms)
	state: TIMER_STOPPED,
	display: 'html'
});

/**
 * Timer class to be instantiated on every element.
 * All relative values will be stored at instance level.
 */
class Timer {
	/**
	 * Construct a Timer instance on the provided element with the given config.
	 * @param  {Object} element HTML node as passed by jQuery
	 * @param  {Object} config User extended options
	 */
	constructor(element, config) {
		// config can/should be a string OR an object
		if (config.duration) {
			config.duration = utils.durationTimeToSeconds(config.duration);
		}
		this.element = element;
		this.config = Object.assign(getDefaultConfig(), config);

		// Store all the data specific to the element on the element itself
		element.dataset.seconds = this.config.seconds;
		element.dataset.totalSeconds = this.config.seconds;
		element.dataset.startTime = utils.unixSeconds() - this.config.seconds;
		element.dataset.state = this.config.state;

		this.element = element;

		if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
			this.config.display = 'val';
		}

		if (this.config.editable) {
			// makeEditable(this);
		}
	}
}

export default Timer;
