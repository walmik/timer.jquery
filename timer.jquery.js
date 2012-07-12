/*!
 * jQuery timer plugin: display a timer inside a div or span or any valid html tag
 * Examples and documentation at: http://walmik.info/demos/timer.jquery
 * version 1 (20-FEB-2012)
 * Requires jQuery v1.3.2 or later
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Author: Walmik Deshpande
 
 usage:
 $("#timerDiv").timer('start');
 $("#timerDiv").timer('start', {seconds: 100}); //provide 100 seconds to start from
 $("#timerDiv").timer('pause');
 $("#timerDiv").timer('reset');
 
  
*/
;(function($)
{
    var secs = 0;
    var mins = 0;
    var hrs = 0;
    var secsStr = "00";
    var minsStr = "00";
    var hrsStr = "00";
    var timerId = null;
    var delay = 1000;
    var type = "string";
    var isTimerRunning = false;
    
    
    $.fn.timer = function(method, options)
    {
        var element = this;
        var settings = $.extend({showHours: false}, options);
        
        if (settings.seconds !== undefined)
        {
            hrs = Math.floor(settings.seconds / 3600);
            mins = Math.floor((settings.seconds - (hrs * 3600))/60);
            secs = settings.seconds - (hrs * 3600) - (mins * 60);
            
            timeToString();
        }
        
        switch(method)
        {
            case "start":
                if(!isTimerRunning) startTimer();
                break;
            
            case "pause":
                pauseTimer();
                break;
            
            case "resume":
                if(!isTimerRunning) startTimerInterval();
                break;
            
            case "reset":
                secs = 0;
                mins = 0;
                hrs = 0;
                break;
            
            case "get_seconds":
                return ( (hrs*3600) + (mins*60) + secs - 1 );
                break;
        }

        function pauseTimer()
        {
            clearInterval(timerId);
            isTimerRunning = false;
        }
        
        function startTimer()
        {
            updateTimerDisplay();
            incrementTime(); //to avoid the 1 second gap that gets created if the seconds are not incremented
            startTimerInterval();
        }
        
        function startTimerInterval()
        {
            timerId = setInterval(incrementTime, delay);
            isTimerRunning = true;
        }
        
        function updateTimerDisplay()
        {
            if(hrs > 0) settings.showHours = true;
            if(settings.showHours) $(element).html(hrsStr + ":" + minsStr + ":" + secsStr);
            else $(element).html(minsStr + ":" + secsStr);
        }
        
        function timeToString()
        {
            if(secs < 10) secsStr = "0" + secs;
            else secsStr = secs;
            
            if(mins < 10) minsStr = "0" + mins;
            else minsStr = mins;
            
            if(hrs < 10) hrsStr = "0" + hrs;
            else hrsStr = hrs;
        }
        
        function incrementTime()
        {
            timeToString();
            updateTimerDisplay();
            
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
})(jQuery);