import test from 'tape';
import Helpers from '../src/helpers.js';

test('test unixSeconds', (t) => {
	t.equal(Helpers.unixSeconds(), Math.round(Date.now() / 1000));
	t.end();
});

test('test timeToSeconds', (t) => {
	t.equal(Helpers.timeToSeconds('5m30s'), 330);
	t.equal(Helpers.timeToSeconds(330), 330);
	t.equal(Helpers.timeToSeconds('30s'), 30);
	t.equal(Helpers.timeToSeconds('5m'), 300);
	t.equal(Helpers.timeToSeconds('5h'), 18000);
	t.equal(Helpers.timeToSeconds('5h30m10s'), 19810);
	t.throws(function() {
		Helpers.timeToSeconds();
	});
	t.end();
});