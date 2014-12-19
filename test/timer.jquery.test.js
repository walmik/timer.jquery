(function($) {

	/*Timer converts seconds to pretty time*/
	var scenarios = [
		{ 'in': 30, out: '30 sec'},
		{ 'in': 100, out: '1:40 min'},
		{ 'in': 1000, out: '16:40 min'},
		{ 'in': 1432, out: '23:52 min'},
		{ 'in': 3599, out: '59:59 min'},
		{ 'in': 3600, out: '1:00:00'},
		{ 'in': 5000, out: '1:23:20'},
		{ 'in': 10000, out: '2:46:40'},
		{ 'in': 50000, out: '13:53:20'},
		{ 'in': 54321, out: '15:05:21'},
		{ 'in': 84000, out: '23:20:00'}
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