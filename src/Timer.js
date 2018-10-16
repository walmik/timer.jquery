/**
 * Timer function to initiate a timer on the provided element with the given config.
 * @param  {Object} element HTML node as passed by jQuery
 * @param  {Object|String} config User extended options or a string (start, pause, resume etc)
 */
function Timer(element, config) {
	this.element = element;
	this.originalConfig = $.extend({}, config);
	this.totalSeconds = 0;
	this.intervalId = null;
	// A HTML element will have the html() method in jQuery to inject content,
	this.html = 'html';
	if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
		// In case of input element or a textarea, jQuery provides the val() method to inject content
		this.html = 'val';
	}

	this.config = utils.getDefaultConfig();

	if (config.duration) {
		config.duration = utils.durationTimeToSeconds(config.duration);
	}

	if (typeof config !== 'string') {
		this.config = $.extend(this.config, config);
	}

	if (this.config.seconds) {
		this.totalSeconds = this.config.seconds;
	}

	if (this.config.editable) {
		utils.makeEditable(this);
	}

	this.startTime = utils.unixSeconds() - this.totalSeconds;

	// In case duration is set along with a callback as well as repeat,
	// then the update frequency needs to be at least 1000ms to prevent callback from being fired more than once
	if (this.config.duration && this.config.repeat && this.config.updateFrequency < 1000) {
		this.config.updateFrequency = 1000;
	}

	// If countdown is set, ensure duration is set as well
	// Also set the total seconds to the duration so that the first render gets the correct value
	if (this.config.countdown) {
		if (!this.config.duration) {
			throw new Error('Countdown option set without duration!');
		}

		if (this.config.editable) {
			throw new Error('Cannot set editable on a countdown timer!');
		}
		this.config.startTime = utils.unixSeconds() - this.config.duration;
		this.totalSeconds = this.config.duration;
	}
}

Timer.prototype.start = function() {
	if (this.state !== Constants.TIMER_RUNNING) {
		utils.setState(this, Constants.TIMER_RUNNING);
		if (this.config.hidden !== true) {
			this.render();
		}
		this.intervalId = setInterval(utils.intervalHandler.bind(null, this), this.config.updateFrequency);
	}
};

Timer.prototype.pause = function() {
	if (this.state === Constants.TIMER_RUNNING) {
		utils.setState(this, Constants.TIMER_PAUSED);
		clearInterval(this.intervalId);
	}
};

Timer.prototype.resume = function() {
	if (this.state === Constants.TIMER_PAUSED) {
		utils.setState(this, Constants.TIMER_RUNNING);
		if (this.config.countdown) {
			this.startTime = utils.unixSeconds() - this.config.duration + this.totalSeconds;
		} else {
			this.startTime = utils.unixSeconds() - this.totalSeconds;
		}
		this.intervalId = setInterval(utils.intervalHandler.bind(null, this), this.config.updateFrequency);
	}
};

Timer.prototype.remove = function() {
	clearInterval(this.intervalId);
	utils.setState(this, Constants.TIMER_REMOVED);
	$(this.element).data(Constants.PLUGIN_NAME, null);
	$(this.element).data('seconds', null);
};

Timer.prototype.reset = function() {
	var originalConfig = this.originalConfig;
	this.remove();
	$(this.element).timer(originalConfig);
};

Timer.prototype.render = function() {
	if (this.config.format) {
		$(this.element)[this.html](utils.secondsToFormattedTime(this.totalSeconds, this.config.format));
	} else {
		$(this.element)[this.html](utils.secondsToPrettyTime(this.totalSeconds));
	}
	$(this.element).data('seconds', this.totalSeconds);
};
