# jQuery Timer plugin

- Lightweight, well tested [![Build Status](https://api.travis-ci.org/walmik/timer.jquery.png)](http://travis-ci.org/walmik/timer.jquery) jQuery *pretty* timer plugin
- Start, Pause, Resume and Remove a timer inside any HTML element.
- Get notified after specific time or at regular intervals.
- Click and edit time while timer is running!
- Enable __multiple timers__ on the same page.

[Demo & Instructions][demo] | [Download][min]

[demo]: http://jquerytimer.com/
[min]: https://raw.githubusercontent.com/walmik/timer.jquery/master/dist/timer.jquery.min.js

## Getting started

If you are using bower,
```bash
bower install timer.jquery
```

Alternatively you can [download][min] the jQuery timer plugin. Then, in your web page:

```html
<script src="path/to/jquery.js" type="text/javascript"></script>
<script src="path/to/timer.jquery.js"></script>
<script>
(function($) {

  //start a timer
  $("#div-id").timer();

}());
</script>
```

### Usage

To start a timer with options:
```javascript
$("#div-id").timer(options);
```

#### Options for timer:

```javascript
$("#div-id").timer({
	seconds:	{Int},		// The number of seconds to start the timer from
	duration: 	{String},	// The time to countdown from. `seconds` and `duration` are mutually exclusive
	callback: 	{Function},	// If duration is set, this function is called after `duration` has elapsed
	repeat: 	{Bool},		// If duration is set, `callback` will be called repeatedly
	format:		{String}	// Format to show time in
});
```

### Methods available on an initialized timer:

```javascript
//pause an existing timer
$("#div-id").timer('pause');

//resume a paused timer
$("#div-id").timer('resume');

//remove an existing timer
$("#div-id").timer('remove');  //leaves the display intact

//get elapsed time in seconds
$("#div-id").data('seconds');
```


### Timed Events

Start a timer and execute a function after a certain duration. You can use this to simulate a timed event.

```javascript
//start a timer & execute a function in 5 minutes & 30 seconds
$('#div-id').timer({
	duration: '5m30s',
	callback: function() {
		alert('Time up!');
	}
});

```

Start a timer and execute a function repeatedly at a certain duration.

```javascript
//start a timer & execute a function every 2 minutes
$('#div-id').timer({
	duration: '2m',
	callback: function() {
		console.log('Why, Hello there');	//you could have a ajax call here instead
	},
	repeat: true //repeatedly calls the callback you specify
});
```

Start a timer and execute a function repeatedly at a certain duration and then reset the timer.

```javascript
//start a timer & execute a function every 2 minutes
$('#div-id').timer({
	duration: '2m',
	callback: function() {
		$('#div-id').timer('reset');
	},
	repeat: true //repeatedly calls the callback you specify
});
```

### Timer state

You can get the current state of timer by querying the `state` property on it's data object

```javascript
$('#div-id').data('state'); 	// running | paused | stopped
```

##### Duration Syntax

When you initialize a timer with the `duration` and `callback` parameters, the timer plugin executes the callback function at the set duration. The syntax for specifying the duration is verbose. `h` for hours. `m` for minutes and `s` for seconds. Here are some examples:

```javascript
'3h15m'		// 3 hours, 15 minutes
'15m'		// 15 minutes
'30s'		// 30 seconds
'2m30s'		// 2 minutes 30 seconds
'2h15m30s'	// 2 hours 15 minutes and 30 seconds
```

##### Format Syntax

By default the timer displays the biggest whole unit. Examples:
* `seconds: 50` will show as `50 sec`
* `seconds: 63` will show as `1:03 min`
* `seconds: 3663` will show as `1:01:03`

If you want to customize the format in which the timer displays time, use the `format` option. Available formats the timer understands are:

| Format | Description | Example |
|:------:|-------------|---------|
| `%h` | Non-zero padded *Hours* | `%h hours` gives `3 hours` |
| `%m` | Non-zero padded *Minutes* unless number of minutes is greater than 60 | `%h:%m minutes` gives `0:6 minutes` or `1:06 minutes` |
| `%g` | Non-zero padded *Total Minutes* Irrelative to hours | `%G minutes` gives `75 minutes` or `6 minutes` |
| `%s` | Non-zero padded *Seconds* unless number of seconds is greater than 60 | `%h:%m:%s` gives `0:0:6` or `0:1:06` or `1:01:06` |
| `%t` | Non-zero padded *Total Seconds* Irrelative to minutes and hours | `%t` gives `3660` or '9' |
| `%H` | Zero padded *Hours* | `%H hours` gives `03 hours` |
| `%M` | Zero padded *Minutes* | `%H:%M minutes` gives `00:06 minutes` |
| `%G` | Zero padded *Total Minutes* Irrelative to hours | `%G minutes` gives `75 minutes` |
| `%S` | Zero padded *Seconds* | `%H:%M:%S` gives `00:00:06` |
| `%T` | Zero padded *Total Seconds* Irrelative to minutes and hours | `%T` gives `3660` |

#### Countdown

You can use the jQuery timer plugin for countdown as well.
```javascript
$('#timerDiv').timer({
    countdown: true,
    duration: '3m40s',    	// This will start the countdown from 3 mins 40 seconds
    callback: function() {	// This will execute after the duration has elapsed
    	console.log('Time up!');
    }
});
```
