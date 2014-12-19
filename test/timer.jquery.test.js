(function($) {

	/*Timer converts seconds to pretty time*/

	//30
	test('timer converts 30 to 30 sec', function() {
		$('#timer').timer({
			seconds: 30
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '30 sec', 'Timer should display 30 sec');
		$('#timer').val('').timer('remove');
	});

	//100
	test('timer converts 100 to 1:40', function() {
		$('#timer').timer({
			seconds: 100
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '1:40 min', 'Timer should display 1:40 min');
		$('#timer').val('').timer('remove');
	});

	//1000
	test('timer converts 1000 to 16:40', function() {
		$('#timer').timer({
			seconds: 1000
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '16:40 min', 'Timer should display 16:40 min');
		$('#timer').val('').timer('remove');
	});

	//1432
	test('timer converts 1432 to 23:52 min', function() {
		$('#timer').timer({
			seconds: 1432
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '23:52 min', 'Timer should display 23:52 min');
		$('#timer').val('').timer('remove');
	});


	//3599
	test('timer converts 3599 to 59:59 min', function() {
		$('#timer').timer({
			seconds: 3599
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '59:59 min', 'Timer should display 59:59 min');
		$('#timer').val('').timer('remove');
	});

	//3600
	test('timer converts 3600 to 1:00:00', function() {
		$('#timer').timer({
			seconds: 3600
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '1:00:00', 'Timer should display 1:00:00');
		$('#timer').val('').timer('remove');
	});

	//5000
	test('timer converts 5000 to 1:23:20', function() {
		$('#timer').timer({
			seconds: 5000
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '1:23:20', 'Timer should display 1:23:20');
		$('#timer').val('').timer('remove');
	});

	//10000
	test('timer converts 10000 to 2:46:40', function() {
		$('#timer').timer({
			seconds: 10000
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '2:46:40', 'Timer should display 2:46:40');
		$('#timer').val('').timer('remove');
	});

	//50000
	test('timer converts 50000 to 13:53:20', function() {
		$('#timer').timer({
			seconds: 50000
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '13:53:20', 'Timer should display 13:53:20');
		$('#timer').val('').timer('remove');
	});

	//54321
	test('timer converts 54321 to 15:05:21', function() {
		$('#timer').timer({
			seconds: 54321
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '15:05:21', 'Timer should display 15:05:21');
		$('#timer').val('').timer('remove');
	});

	//84000
	test('timer converts 84000 to 23:20:00', function() {
		$('#timer').timer({
			seconds: 84000
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '23:20:00', 'Timer should display 23:20:00');
		$('#timer').val('').timer('remove');
	});


	/*Timer converts pretty time to seconds*/

	//30
	test('timer converts 30 sec to 30', function() {
		$('#timer').timer({
			editable: true
		});

		$('#timer').focus();
		$('#timer').val('30 sec');
		$('#timer').blur();

		stop();

		setTimeout(function() {
			equal($('#timer').val(), '32 sec', 'Timer should display 32 sec');
			start();

			$('#timer').val('').timer('remove');
		}, 2100);

	});

})(jQuery)