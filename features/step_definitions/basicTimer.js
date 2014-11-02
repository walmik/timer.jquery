var assert = require('assert');
var basicFeaturesDefinitions = function () {

	var seconds;	//To keep a count of time elapsed since start button was pressed

	this.World = require('../support/world').World;

	this.Given(/^the page with the timer plugin is loaded$/, function (callback) {
		// Write code here that turns the phrase above into concrete actions
		this.browser.visit('http://127.0.0.1:8000', callback);
	});

	this.When(/^I click the Start Timer button$/, function (callback) {
		seconds = (new Date()).getSeconds();
		this.browser.pressButton('Start', function () {
			callback();
		});

	});

	this.Then(/^the timer field should display the number of seconds elapsed since time it was started$/, function (callback) {

		//Update seconds since 'Start timer' was clicked
		seconds = ( new Date() ).getSeconds() - seconds;

		//Get the timer input field
		var timerField = this.browser.field('.timer');

		//Check its value against elapsed time
		if(seconds + ' sec' == timerField.value) {
			callback();
		} else {
			callback.fail(new Error('Expected elapsed time to be: ' + seconds + ' sec'));
		}

		this.browser.close();

	});
};

module.exports = basicFeaturesDefinitions;