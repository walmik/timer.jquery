const Helpers = {
	unixSeconds: () => (Math.round(Date.now() / 1000)),

	secondsToPrettyTime: () => {

	},

	// Convert a shorthand time format like `5m30s` to seconds 330
	timeToSeconds: (time) => {
		if (!time) {
			throw new Error('timeToSeconds expects an argument!');
			return;
		}

		// Early return in case number is provided
		if (!isNaN(Number(time))) {
			return time;
		}

		time = time.toLowerCase();

		let hrs = time.match(/\d{1,2}h/);
		let mins = time.match(/\d{1,2}m/);
		let secs = time.match(/\d{1,2}s/);
		let seconds = 0;

		if (hrs) {
			seconds += Number(hrs[0].replace('h', '') * 3600)
		}

		if (mins) {
			seconds += Number(mins[0].replace('m', '')) * 60;
		}

		if (secs) {
			seconds += Number(secs[0].replace('s', ''));
		}

		return seconds;
	}
	
};

export default Helpers;