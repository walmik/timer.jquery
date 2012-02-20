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
 $("#timerDiv").initTimer();
 $("#timerDiv").initTimer(120); //provide seconds to start from
 
 $("#timerDiv").pauseTimer();   //not implemented yet
 $("#timerDiv").resetTimer();   //not implemented yet
 $("#timerDiv").startTimer();   //not implemented yet
  
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
    var isTimerRunning = false;
    var delay = 1000;
    var type = "string";
    
    
    $.fn.timer = function(method)
    {
        var element = this;
        var settings = $.extend({showHours: false});

        switch(method)
        {
            case "init":
                showTimer();
                secs++;     //to avoid the 1 second gap that gets created if the seconds are not incremented
                initTimer();
                break;
            
            case "pause":
                pauseTimer();
                break;
        }

        function pauseTimer()
        {
            clearInterval(timerId);
        }
        
        function initTimer()
        {
            console.log("start");
            timerId = setInterval(incrementTime, delay);
            isTimerRunning = true;
            $(element).attr("isTimerRunning", true);            //check this attr later for pausing or restarting
        }
        
        function showTimer()
        {
            //console.log("show time");
            if(settings.showHours) $(element).html(hrsStr + ":" + minsStr + ":" + secsStr);
            else $(element).html(minsStr + ":" + secsStr);
        }
        
        function incrementTime()
        {
            //console.log("increment time");
            if(secs < 10) secsStr = "0" + secs;
            else secsStr = secs;
            
            if(mins < 10) minsStr = "0" + mins;
            else minsStr = mins;
            
            if(hrs < 10) hrsStr = "0" + hrs;
            else hrsStr = hrs;
            
            showTimer();
            
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