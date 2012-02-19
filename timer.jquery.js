/*
 timer.jquery.js
 ---------------
 display a timer inside a div or span or any valid html tag
 
 usage:
 $("#timerDiv").initTimer();
 $("#timerDiv").initTimer(120); //provide seconds to start from
 
 $("#timerDiv").pauseTimer();
 $("#timerDiv").resetTimer();
 $("#timerDiv").pauseTimer();
  
*/

jQuery.fn.timer = function(s)
{
    var element = $(this);
    if(s == undefined) s = 0;
    $(element).html(s);
}