@basic
Feature: Basic Timer Functionality
	As a user of the timer plugin
	I want to start the timer

	@start
	Scenario: Start timer
		Given the page with the timer plugin is loaded
		When I click the Start Timer button
		Then the timer field should display the number of seconds elapsed since time it was started