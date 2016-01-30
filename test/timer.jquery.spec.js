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

			$('#timer-input').timer('remove');
			expect($('#timer-input').data('state')).toBe(null);
		});
	});
});
