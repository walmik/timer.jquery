/*
 timer.jquery.js
 ---------------
 display a timer inside a div or span or any valid html tag
 
 usage:
 $("#timerDiv").initTimer();
 $("#timerDiv").initTimer(120); //provide seconds to start from
 
 $("#timerDiv").pauseTimer();   //not implemented yet
 $("#timerDiv").resetTimer();   //not implemented yet
 $("#timerDiv").startTimer();   //not implemented yet
  
*/

jQuery.fn.timer = function()
{
    
    var element = $(this);

    var secs = 0;
    var mins = 0;
    var hrs = 0;
    var secsStr = "00";
    var minsStr = "00";
    var hrsStr = "00";
    var timerId = null;
    var isTimerRunning = false;
    var delay = 1000;
    var showHours = true; //set to false in case of timers less than 60 mins
    var type = "string";
    
    initTimer();
    
    function initTimer()
    {
        console.log("start");
        timerId = setInterval(incrementTime, delay);
        isTimerRunning = true;
    }
    
    function showTime()
    {
        console.log("show time");
        if(showHours) $(element).html(hrsStr + ":" + minsStr + ":" + secsStr);
        else $(element).html(minsStr + ":" + secsStr);
    }
    
    function incrementTime()
    {
        console.log("increment time");
        if(secs < 10) secsStr = "0" + secs;
        else secsStr = secs;
        
        if(mins < 10) minsStr = "0" + mins;
        else minsStr = mins;
        
        if(hrs < 10) hrsStr = "0" + hrs;
        else hrsStr = hrs;
        
        showTime();
        
        secs++;
        
        if(secs % 60 == 0)
        {
            mins++;
            secs = 0;
        }
        
        //handle time exceeding 60 mins!
        if(mins > 59 && mins % 60 == 0)
        {
            hrs++;
            mins = 0;
        }
    }
    
}