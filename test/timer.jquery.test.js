(function($) {
	test('convertToSeconds', function() {
		$('#timer').timer({
			seconds: 1000
		});
		$('#timer').timer('pause');
		equal($('#timer').val(), '1:40 min', 'Timer should display 1:40 min');
	});


})(jQuery)