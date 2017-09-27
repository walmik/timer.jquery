describe('Timed functions', function() {
	beforeEach(function() {
		setFixtures('<div id="timer"></div>');
	});

	// Start a timer in a DIV
	describe('Start a timer in a DIV', function() {
		var timeElapsed = 0;
		beforeEach(function(done) {
			$('#timer').timer();
			setTimeout(done, 1000);
		});

		it('Should be true if the async call has completed', function() {
			expect($('#timer').data('seconds')).toEqual(1);
		});
	});

	// Start timer in an INPUT element
	describe('Start a timer in a INPUT element', function() {
		beforeEach(function(done) {
			setFixtures('<input id="inputTimer" type="text"/>');
			$('#inputTimer').timer();
			setTimeout(done, 1000);
		});

		it('Should be true if the async call has completed', function() {
			expect($('#inputTimer').data('seconds')).toEqual(1);
		});
	});

	// Pause a timer
	describe('Pause a running timer', function() {
		beforeEach(function(done) {
			$('#timer').timer();
			$('#timer').timer('pause');
			setTimeout(done, 1000);
		});

		it('Should be true if the async call has completed', function() {
			// Even when we wait for a second, the time elapsed shouldnt change
			// as we had immediately paused the timer after starting it
			expect($('#timer').data('seconds')).toEqual(0);
		});
	});

	// Pause and Resume a timer
	describe('Pause and Resume a timer', function() {
		beforeEach(function(done) {
			$('#timer').timer();
			$('#timer').timer('pause');
			expect($('#timer').data('state')).toBe('paused');
			setTimeout(done, 1000);
		});

		it('Should be true if the async call has completed', function() {
			$('#timer').timer('resume');
			expect($('#timer').data('state')).toBe('running');
		});
	});

	// Execute a function after a set time
	describe('Execute a function after a set time', function() {
		var flag;
		beforeEach(function(done) {
			$('#timer').timer({
				callback: function() {
					flag = true;
				},
				duration: 1
			});
			setTimeout(done, 1000);
		});

		it('Should call a function after the provided duration is complete', function() {
			expect(flag).toBe(true);
		});
	});

	// Execute a function after a set time
	describe('Execute a function after a set time provided in pretty syntax', function() {
		var flag;
		beforeEach(function(done) {
			$('#timer').timer({
				callback: function() {
					flag = true;
				},
				seconds: 99,
				duration: '1m40s'	// Expects callback to be executed in 100 seconds
			});
			setTimeout(done, 1000);
		});

		it('Should call a function after the provided duration is complete', function() {
			expect(flag).toBe(true);
			expect($('#timer')).toContainText('1:40 min');
		});
	});
});
