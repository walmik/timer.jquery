# jQuery Timer plugin

Start/Stop/Resume a timer inside any HTML element.

## Getting Started
Download the [production version][min].

[min]: https://github.com/walmik/timer.jquery/archive/master.zip

In your web page:

```html
<script src="libs/jquery/jquery.js" type="text/javascript"></script>
<script src="src/timer.jquery.js"></script>
<script>
jQuery(function($) {
  $("#div-id").timer("start", {seconds: 3000});
});
</script>
```

## Demo
http://walmik.info/demos/timer.jquery/