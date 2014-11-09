var assert = require('assert');
var basicFeaturesDefinitions = function () {

	var seconds;	//To keep a count of time elapsed since start button was pressed

	this.World = require('../support/world').World;

	///////////////////////////////////////////////////////////////////////////
	///////////////////////////////////START///////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
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


	///////////////////////////////////////////////////////////////////////////
	///////////////////////////////////PAUSE///////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	this.Given(/^the timer is started on a page$/, function (callback) {
		//open browser and point to a page with the timer
		var self = this;
		this.browser.visit('http://127.0.0.1:8000', function () {
			self.browser.pressButton('Start', function () {
				callback();
			});
		});
	});

	this.When(/^I click the Pause Timer button$/, function (callback) {
		this.browser.pressButton('Pause', function () {
			callback();
		});
	});

	this.Then(/^the timer should pause$/, function (callback) {
		var self = this;
		//Get the timer input field
		var timerFieldValue = this.browser.field('.timer').value;

		//wait for a bit and check the timer field value
		this.browser.wait(3000, function () {
			if( timerFieldValue == self.browser.field('.timer').value ) {
				callback();
			} else {
				callback.fail(new Error('Timer failed to pause!'));
			}
			
		});
	});
};

module.exports = basicFeaturesDefinitions;