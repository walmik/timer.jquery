import test from 'tape';
import utils from '../src/utils.js';

test('test unixSeconds', (t) => {
	t.equal(utils.unixSeconds(), Math.round(Date.now() / 1000));
	t.end();
});

test('test timeFormatToSeconds', (t) => {
	t.equal(utils.timeFormatToSeconds(330), 330);
	t.equal(utils.timeFormatToSeconds('5m30s'), 330);
	t.equal(utils.timeFormatToSeconds('30s'), 30);
	t.equal(utils.timeFormatToSeconds('5m'), 300);
	t.equal(utils.timeFormatToSeconds('5h'), 18000);
	t.equal(utils.timeFormatToSeconds('5h30m10s'), 19810);
	t.throws(function() {
		utils.timeFormatToSeconds();
	});
	t.throws(function() {
		utils.timeFormatToSeconds('invalid-format');
	});
	t.end();
});

test('test secondsToTimeObj', (t) => {
	t.deepEqual(utils.secondsToTimeObj(100), {
		hours: 0,
		minutes: 1,
		totalMinutes: 1,
		seconds: 40,
		totalSeconds: 100
	});
	t.deepEqual(utils.secondsToTimeObj(1000), {
		hours: 0,
		minutes: 16,
		totalMinutes: 16,
		seconds: 40,
		totalSeconds: 1000
	});
	t.end();
});