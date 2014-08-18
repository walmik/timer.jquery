# jQuery Timer plugin

Start/Stop/Resume/Remove a timer inside any HTML element.

[Demo & Instructions][demo] | [Download][min]

[demo]: http://walmik.info/demos/timer.jquery/
[min]: https://github.com/walmik/timer.jquery/archive/master.zip

### How to use

In your web page:

```html
<script src="libs/jquery/jquery.js" type="text/javascript"></script>
<script src="src/timer.jquery.js"></script>
<script>
(function($) {

  //start a timer
  $("#div-id").timer('start');
  
}());
</script>
```

### Usage Instructions

Methods available on an initialized timer:

```javascript

//pause an existing timer
$("#div-id").timer('pause');
  
//resume a paused timer
$("#div-id").timer('resume');
  
//remove an existing timer
$("#div-id").timer('remove');  //leaves the display intact (only removes the timer from the element)
  
//get elapsed time in seconds
$("#div-id").data('seconds');
  
```
