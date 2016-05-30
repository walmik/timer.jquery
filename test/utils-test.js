import test from 'tape';
import utils from '../src/utils.js';

test('test unixSeconds', (t) => {
	t.equal(utils.unixSeconds(), Math.round(Date.now() / 1000));
	t.end();
});

test('test durationTimeToSeconds', (t) => {
	t.equal(utils.durationTimeToSeconds(330), 330);
	t.equal(utils.durationTimeToSeconds('5m30s'), 330);
	t.equal(utils.durationTimeToSeconds('30s'), 30);
	t.equal(utils.durationTimeToSeconds('5m'), 300);
	t.equal(utils.durationTimeToSeconds('5h'), 18000);
	t.equal(utils.durationTimeToSeconds('5h30m10s'), 19810);
	t.throws(function() {
		utils.durationTimeToSeconds();
	});
	t.throws(function() {
		utils.durationTimeToSeconds('invalid-format');
	});
	t.end();
});

test('test secondsToPrettyTime', (t) => {
	t.equal(utils.secondsToPrettyTime(100), '1:40 min');
	t.equal(utils.secondsToPrettyTime(1000), '16:40 min');
	t.equal(utils.secondsToPrettyTime(1234), '20:34 min');
	t.end();
});

test('test prettyTimeToSeconds', (t) => {
	t.equal(utils.prettyTimeToSeconds('1:40 min'), 100);
	t.equal(utils.prettyTimeToSeconds('16:40 min'), 1000);
	t.equal(utils.prettyTimeToSeconds('20:34 min'), 1234);
	t.end();
});