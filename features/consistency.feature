@tag1
Feature: Check Consistency
	As a user of the timer plugin
	I want to start it

	@tag2
	Scenario: Start timer
		Given the page with the timer plugin is loaded
		When I click the Start Timer button
		Then the timer field should display number of seconds elapsed since time was started