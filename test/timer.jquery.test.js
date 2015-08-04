(function($) {

	var callbackExecuted = false,
		scenarios = [],
		count = 0;	// To print 'Done! on completion of tests

	test('timer supports countdown', function() {
		$('#timer').timer({
			duration: '3s',
			countdown: true,
			callback: function() {
				$('#timer').timer('pause');
			}
		});

		// Pause test momentarily
		stop();

		// Check value of callbackExecuted in 3 seconds (+ minor offset to run assertion comfortably)
		setTimeout(function() {
			equal($('#timer').data('seconds'), 0, 'Timer counts down to 0 seconds if countdown was enabled.');
			$('#timer').val('').timer('remove');

			start();
		}, 3500);
	});

	// Timer parses duration syntax correctly
	test('timer parses duration syntax correctly', function() {
		callbackExecuted = false;

		$('#timer').timer({
			editable: true,
			duration: '10s',
			callback: function() {
				callbackExecuted = true;
			}
		});

		// Push time to a second before end of specified duration
		$('#timer').focus();
		$('#timer').val('9 sec');
		$('#timer').blur();

		// Pause test momentarily
		stop();

		// Check value of callbackExecuted in 3 seconds (+ minor offset to run assertion comfortably)
		setTimeout(function() {
			equal(callbackExecuted, true, 'Timer translates duration of 10s correctly.');
			$('#timer').val('').timer('remove');

			start();
		}, 2500);
	});

	// Syntax for timer duration 5m30s translates to correct value in time
	test('timer executes callback after the specified duration', function() {
		callbackExecuted = false;

		$('#timer').timer({
			editable: true,
			duration: '5m30s',
			callback: function() {
				callbackExecuted = true;
			}
		});

		// Push time to a second before end of specified duration
		$('#timer').focus();
		$('#timer').val('5:29 min');
		$('#timer').blur();
		// Pause test momentarily
		stop();

		// Check value of callbackExecuted in 3 seconds (+ minor offset to run assertion comfortably)
		setTimeout(function() {
			equal(callbackExecuted, true, 'Timer translates duration of 5m30s correctly.');
			$('#timer').val('').timer('remove');

			start();
		}, 2200);
	});

	// Timer resets to 0 seconds if reset was called
	test('timer resets to 0 seconds if reset was called', function() {
		$('#timer').timer({
			duration: '3s',
			callback: function() {
				$('#timer').timer('reset');
				$('#timer').timer('pause');
			}
		});

		// Pause test momentarily
		stop();

		// Check value of callbackExecuted in 3 seconds (+ minor offset to run assertion comfortably)
		setTimeout(function() {
			equal($('#timer').data('seconds'), 0, 'Timer resets to 0 seconds if reset was called.');
			$('#timer').val('').timer('remove');

			start();
		}, 3500);
	});

	// Timer executes callback after the specified duration has elapsed
	test('timer executes callback after the specified duration', function() {
		callbackExecuted = false;

		$('#timer').timer({
			duration: '3s',
			callback: function() {
				callbackExecuted = true;
			}
		});

		// Pause test momentarily
		stop();

		// Check value of callbackExecuted in 3 seconds (+ minor offset to run assertion comfortably)
		setTimeout(function() {
			equal(callbackExecuted, true, 'Timer executes callback after the specified duration has elapsed.');
			$('#timer').val('').timer('remove');

			start();
		}, 3500);
	});

	// Timer starts from a given number of seconds
	test('timer starts from a given number of seconds', function() {
		$('#timer').timer({
			seconds: 1000
		});

		// Pause test momentarily
		stop();

		// Check value of callbackExecuted in 3 seconds (+ minor offset to run assertion comfortably)
		setTimeout(function() {
			equal($('#timer').val(), '16:42 min', 'Timer starts from a given number of seconds.');
			$('#timer').val('').timer('remove');

			start();
		}, 2500);
	});

	// Timer adjusts duration in case repeat is set to true
	/*test('timer adjusts duration in case repeat is set to true', function() {

		var callbackCalledCount = 0;

		$('#timer').timer({
			duration: '2s',
			callback: function() {
				callbackCalledCount++;
			},
			repeat: true
		});

		// Pause test momentarily
		stop();

		// Check value of callbackCalledCount in 6 seconds (+ minor offset to run assertion comfortably)
		setTimeout(function() {
			equal(callbackCalledCount, 3, 'Timer adjusts duration in case repeat is set to true.');
			$('#timer').val('').timer('remove');
		}, 6500);
	});*/

	// Timer converts duration syntax with hours correctly
	test('timer parses duration syntax with hours, minutes and seconds correctly', function() {
		callbackExecuted = false;

		$('#timer').timer({
			editable: true,
			duration: '5h30m10s',
			callback: function() {
				callbackExecuted = true;
			}
		});

		// Push time to a second before end of specified duration
		$('#timer').focus();
		$('#timer').val('5:30:08');
		$('#timer').blur();
		// Pause test momentarily
		stop();

		// Check value of callbackExecuted in 2 seconds (+ offset to run assertion comfortably)
		setTimeout(function() {
			equal(callbackExecuted, true, 'Timer translates duration of 5h30m10s correctly.');
			$('#timer').val('').timer('remove');

			start();
		}, 2500);
	});

	// Timer converts seconds to pretty time
	scenarios = [
		{'in': 30, out: '30 sec'},
		{'in': 100, out: '1:40 min'},
		{'in': 1000, out: '16:40 min'},
		{'in': 1432, out: '23:52 min'},
		{'in': 3599, out: '59:59 min'},
		{'in': 3600, out: '1:00:00'},
		{'in': 5000, out: '1:23:20'},
		{'in': 10000, out: '2:46:40'},
		{'in': 50000, out: '13:53:20'},
		{'in': 54321, out: '15:05:21'},
		{'in': 84000, out: '23:20:00'}
	];

	scenarios.forEach(function(obj) {
		test('timer converts ' + obj['in'] + ' to ' + obj.out, function() {
			$('#timer').timer({
				seconds: obj['in']
			});
			$('#timer').timer('pause');
			equal($('#timer').val(), obj.out, 'Timer should display ' + obj.out);
			$('#timer').val('').timer('remove');
		});
	});

	// Timer converts pretty time to seconds
	scenarios = [
		{'in': '30 sec', out: 30, display: '32 sec'},
		{'in': '1:40 min', out: 100, display: '1:42 min'},
		{'in': '16:40 min', out: 1000, display: '16:42 min'},
		{'in': '23:52 min', out: 1432, display: '23:54 min'},
		{'in': '59:59 min', out: 3599, display: '1:00:01'},
		{'in': '1:00:00', out: 3600, display: '1:00:02'},
		{'in': '1:23:20', out: 5000, display: '1:23:22'},
		{'in': '2:46:40', out: 10000, display: '2:46:42'},
		{'in': '13:53:20', out: 50000, display: '13:53:22'},
		{'in': '15:05:21', out: 54321, display: '15:05:23'},
		{'in': '23:20:00', out: 84000, display: '23:20:02'}
	];

	scenarios.forEach(function(obj) {
		test('timer converts ' + obj['in'] + ' to ' + obj.out, function() {
			$('#timer').timer({
				editable: true
			});

			$('#timer').focus();
			$('#timer').val(obj['in']);
			$('#timer').blur();

			stop();

			setTimeout(function() {
				equal($('#timer').val(), obj.display, 'Timer should display ' + obj.display);
				start();

				$('#timer').val('').timer('remove');

				count++;

				// Remove 'tests running' message if all scenarios are done
				if (scenarios.length === count) {
					$('#msg').html('Done!').removeClass('highlight');
				}
			}, 2150);

		});
	});

	// Timer is resumable
	test('timer can be paused and then resumed', function() {
		callbackExecuted = false;

		$('#timer').timer({
			seconds: 10
		});

		// Pause timer
		$('#timer').timer('pause');

		// Pause test momentarily
		stop();

		// Resume timer in 2 seconds (+ offset to run assertion comfortably)
		setTimeout(function() {
			$('#timer').timer('resume');
		}, 2200);

		// Start another timeout with 4 seconds and check timer value
		setTimeout(function() {
			equal($('#timer').val(), '12 sec', 'Timer can be paused and resumed successfully.');
			$('#timer').val('').timer('remove');

			start();
		}, 4500);

	});

	// Timer has readable states - stopped, running & pause
	test('timer has readable states', function() {
		callbackExecuted = false;

		$('#timer').timer({
			seconds: 10
		});

		equal($('#timer').data('state'), 'running', 'Timer has state - running');

		// Pause timer
		$('#timer').timer('pause');

		// Pause test momentarily
		stop();

		equal($('#timer').data('state'), 'paused', 'Timer has state - paused');

		// Resume timer in 2 seconds (+ offset to run assertion comfortably)
		setTimeout(function() {
			$('#timer').timer('resume');
		}, 2200);

		// Start another timeout with 4 seconds and check timer value
		setTimeout(function() {
			equal($('#timer').val(), '12 sec', 'Timer can be paused and resumed successfully.');
			equal($('#timer').data('state'), 'running', 'Timer has state - running');
			$('#timer').val('').timer('remove');

			start();
		}, 4500);

	});

})(jQuery)
