define(['jquery', 'fixtures', 'timer'], function($, Fixtures, timer) {
	describe('timer.jquery', function() {
		beforeEach(function() {
			setFixtures(Fixtures.main);
		});

		it('should start, pause, resume and remove timer', function() {
			$('#timer-input').timer('start');
			expect($('#timer-input').data('state')).toBe('running');

			$('#timer-input').timer('pause');
			expect($('#timer-input').data('state')).toBe('paused');

			$('#timer-input').timer('resume');
			expect($('#timer-input').data('state')).toBe('running');

			$('#timer-input').timer('reset');
			expect($('#timer-input').data('state')).toBe('stopped');

			$('#timer-input').timer('remove');
			expect($('#timer-input').data('state')).toBe(null);
		});

		it('should start the timer and run as expected', function(done) {
			$('#timer-input').timer();
			setTimeout(function() {
				expect($('#timer-input').val()).toBe('2 sec');
				$('#timer-input').timer('remove');
				done();
			}, 3000);
		});

		it('should start the timer from the provided seconds', function() {
			$('#timer-input').timer({
				seconds: 10
			});
			expect($('#timer-input').val()).toBe('10 sec');
			$('#timer-input').timer('remove');
		});

		// Test pretty display
		[
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
		].forEach(function(obj) {
			it('should convert seconds to pretty time', function(done) {
				$('#timer-input').timer({
					editable: true
				});
				$('#timer-input').focus();
				$('#timer-input').val(obj.in);
				$('#timer-input').blur();

				setTimeout(function() {
					expect($('#timer-input').val()).toBe(obj.display);
					done();
				}, 2200);

			});
		});

		it('should allow editing a running timer and continue from updated value', function(done) {
			$('#timer-input').timer({
				seconds: 100,
				editable: true
			});
			$('#timer-input').focus();
			$('#timer-input').val('2:50 min');
			$('#timer-input').blur();
			setTimeout(function() {
				expect($('#timer-input').val()).toBe('2:51 min');
				$('#timer-input').timer('remove');
				done();
			}, 1000);
		});

		it('should allow pause and resume', function(done) {
			$('#timer-input').timer({
				seconds: 10
			});
			$('#timer-input').timer('pause');
			// pause for a second & resume
			setTimeout(function() {
				$('#timer-input').timer('resume');
				setTimeout(function() {
					expect($('#timer-input').val()).toBe('11 sec');
					$('#timer-input').timer('remove');
					done();
				}, 1000);
			}, 1000);
		});
	});
});
