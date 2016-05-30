/* global $:true */

import Timer from './Timer';
const pluginName = 'timer';
(function() {
	$.fn.timer = function(options) {
		options = options || 'start';

		return this.each(function() {
			if (!($.data(this, pluginName) instanceof Timer)) {
				/**
				 * Create a new data attribute on the element to hold the plugin name
				 * This way we can know which plugin(s) is/are initialized on the element later
				 */
				$.data(this, pluginName, new Timer(this, options));
			}

			/**
			 * Use the instance of this plugin derived from the data attribute for this element
			 * to conduct whatever action requested as a string parameter.
			 */
			var instance = $.data(this, pluginName);

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
})();
