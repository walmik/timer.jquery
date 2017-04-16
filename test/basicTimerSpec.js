describe('Basic functions', function() {

	beforeEach(function() {
		setFixtures('<div id="timer"></div>');
	});

	it('should set a timer attribute on the prototype(fn) of $', function() {
		expect($.fn.timer).toExist();
	});

	it('allows starting a timer in a given dom element', function() {
		$('#timer').timer();
		// The jQuery timer plugin adds a data attribute named 'timer' 
		// to the element on which it is initialized
		expect($('#timer')).toHaveData('timer');
	});

	it('allows starting a timer with a given value', function() {
		$('#timer').timer({
			seconds: 5
		});
		expect($('#timer')).toContainText('5 sec');
	});

	it('allows starting a timer where a value given in seconds converts to pretty time', function() {
		$('#timer').timer({
			seconds: 100
		});
		expect($('#timer')).toContainText('1:40 min');
	});

	it('allows starting a timer with a custom time format', function() {
		$('#timer').timer({
			seconds: 100,
			format: '%H:%M:%S' //Display time as 00:00:00
		});
		expect($('#timer')).toContainText('00:01:40');
	});

	it('allows starting a timer with a custom time format', function() {
		$('#timer').timer({
			seconds: 100,
			format: '%m minutes %s seconds' //Display time as 00:00:00
		});
		expect($('#timer')).toContainText('1 minutes 40 seconds');
	});
});

