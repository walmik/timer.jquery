# jQuery Timer plugin

- Lightweight, well tested, jQuery *pretty* timer plugin
- Start, Pause, Resume and Remove a timer inside any HTML element.
- Get notified after specific time or at regular intervals.
- Click and edit time while timer is running!

[Demo & Instructions][demo] | [Download][min] | [![Build Status](https://api.travis-ci.org/walmik/timer.jquery.png)](http://travis-ci.org/walmik/timer.jquery)

[demo]: http://jquerytimer.com/
[min]: https://github.com/walmik/timer.jquery/archive/master.zip

### How to use

In your web page:

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

### Usage Instructions

Start a timer from 100 seconds (1:40)
```javascript
$("#div-id").timer({
    seconds: 100
});
```
Methods available on an initialized timer:

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

Start a timer and execute a function repeatedly at a certain duration. You can use this to sync current state with the backend by initiating a ajax request at regular intervals.

```javascript
//start a timer & execute a function every 2 minutes
$('#div-id').timer({
	duration: '2m',
	callback: function() {
		alert('Why, Hello there');	//you could have a ajax call here instead
	},
	repeat: true //repeatedly calls the callback you specify
});
```

#### Duration Syntax

When you initialize a timer with the `duration` and `callback` parameters, the timer plugin executes the callback function at the set duration. The syntax for specifying the duration is verbose. `h` for hours. `m` for minutes and `s` for seconds. Here are some examples:

```javascript
'3h15m'		// 3 hours, 15 minutes
'15m'		// 15 minutes
'30s'		// 30 seconds
'2m30s'		// 2 minutes 30 seconds
'2h15m30s'	// 2 hours 15 minutes and 30 seconds
```
