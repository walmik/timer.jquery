var test = require('tape');
var fs = require('fs');

// Load utils and constants in the global scope of this file to run tests on:
/* jshint ignore:start */
eval(fs.readFileSync(__dirname + '/../src/constants.js') + '');
eval(fs.readFileSync(__dirname + '/../src/utils.js') + '');
/* jshint ignore:end */

test('test unixSeconds', function(t) {
	t.equal(utils.unixSeconds(), Math.round(Date.now() / 1000));
	t.end();
});

test('test getDefaultConfig', function(t) {
	var config = utils.getDefaultConfig();
	t.equal(config.seconds, 0);
	t.equal(config.duration, null);
	t.equal(config.editable, false);
	t.equal(config.repeat, false);
	t.equal(config.countdown, false);
	t.equal(config.updateFrequency, 500);
	t.end();
});

test('test secondsToFormattedTime', function(t) {
	t.equal(utils.secondsToFormattedTime(100, '%m:%s'), '1:40');
	t.equal(utils.secondsToFormattedTime(3, '%m:%s'), '0:3');
	t.equal(utils.secondsToFormattedTime(1000, '%M minutes'), '16 minutes');
	t.equal(utils.secondsToFormattedTime(1000, '%T seconds'), '1000 seconds');
	t.equal(utils.secondsToFormattedTime(1000, '%H:%M:%S'), '00:16:40');
	t.equal(utils.secondsToFormattedTime(1000, '%h:%M:%S'), '0:16:40');
	t.equal(utils.secondsToFormattedTime(5, '%h:%m:%s'), '0:0:5');
	t.equal(utils.secondsToFormattedTime(365, '%h:%m:%s'), '0:6:5');
	t.equal(utils.secondsToFormattedTime(365, '%d:%h:%m:%s'), '0:0:6:5');
	t.equal(utils.secondsToFormattedTime(451810, '%d:%h:%m:%s'), '5:5:30:10');
	t.equal(utils.secondsToFormattedTime(280929, '%D:%H:%m:%s'), '03:06:2:9');
	t.end();
});

test('test durationTimeToSeconds', function(t) {
	t.equal(utils.durationTimeToSeconds(330), 330);
	t.equal(utils.durationTimeToSeconds('5m30s'), 330);
	t.equal(utils.durationTimeToSeconds('30s'), 30);
	t.equal(utils.durationTimeToSeconds('5m'), 300);
	t.equal(utils.durationTimeToSeconds('5h'), 18000);
	t.equal(utils.durationTimeToSeconds('5h30m10s'), 19810);
	t.equal(utils.durationTimeToSeconds('5d5h30m10s'), 451810);
	t.equal(utils.durationTimeToSeconds('05d05h30m10s'), 451810);
	t.throws(function() {
		utils.durationTimeToSeconds();
	});
	t.throws(function() {
		utils.durationTimeToSeconds('invalid-format');
	});
	t.end();
});

test('test secondsToPrettyTime', function(t) {
	t.equal(utils.secondsToPrettyTime(100), '1:40 min');
	t.equal(utils.secondsToPrettyTime(1000), '16:40 min');
	t.equal(utils.secondsToPrettyTime(1234), '20:34 min');
	t.equal(utils.secondsToPrettyTime(19810), '5:30:10');
	t.equal(utils.secondsToPrettyTime(451810), '5:05:30:10');
	t.end();
});

test('test prettyTimeToSeconds', function(t) {
	t.equal(utils.prettyTimeToSeconds('1:40 min'), 100);
	t.equal(utils.prettyTimeToSeconds('16:40 min'), 1000);
	t.equal(utils.prettyTimeToSeconds('20:34 min'), 1234);
	t.equal(utils.prettyTimeToSeconds('5:30:10'), 19810);
	t.equal(utils.prettyTimeToSeconds('03:06:02:09'), 280929);
	t.equal(utils.prettyTimeToSeconds('3:06:02:09'), 280929);
	t.end();
});
