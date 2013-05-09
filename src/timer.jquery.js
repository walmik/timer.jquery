/*
 * timer.jquery
 * https://github.com/walmik/timer.jquery
 *
 * Copyright (c) 2013 Walmik Deshpande
 * Licensed under the MIT license.
 */

 /*
 Usage:
 $("#timerDiv").timer('start');
 $("#timerDiv").timer('start', {seconds: 100}); //provide 100 seconds to start from
 $("#timerDiv").timer('pause');
 $("#timerDiv").timer('reset');
 */

;(function($)
{
    var secsNum = 0,
        minsNum = 0,
        hrsNum = 0,
        secsStr = "00",
        minsStr = "00",
        hrsStr = "00",
        timerId = null,
        delay = 1000,
        isTimerRunning = false;
    
    /*
        @method STRING = start,pause,resume
        @options OBJECT = { seconds NUMBER: 2000 }
    */
    $.fn.timer = function(method, options)
    {
        var element = this,
            settings = $.extend({ showHours: false }, options );
        
        if (settings.seconds !== undefined)
        {
            hrsNum = Math.floor(settings.seconds / 3600);
            minsNum = Math.floor((settings.seconds - (hrsNum * 3600))/60);
            secsNum = settings.seconds - (hrsNum * 3600) - (minsNum * 60);
            
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
                secsNum = 0;
                minsNum = 0;
                hrsNum = 0;
                break;
            
            case "get_seconds":
                return ( (hrsNum*3600) + (minsNum*60) + secsNum - 1 );
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
            if(hrsNum > 0) settings.showHours = true;
            if(settings.showHours) $(element).html(hrsStr + ":" + minsStr + ":" + secsStr);
            else $(element).html(minsStr + ":" + secsStr);
        }
        
        function timeToString()
        {
            secsStr = secsNum < 10 ? "0" + secsNum : secsNum;
            minsStr = minsNum < 10 ? "0" + minsNum : minsNum;
            hrsStr = hrsNum < 10 ? "0" + hrsNum : hrsNum;
        }
        
        function incrementTime()
        {
            timeToString();
            updateTimerDisplay();
            
            secsNum++;
            if(secsNum % 60 == 0)
            {
                minsNum++;
                secsNum = 0;
            }
            
            //handle time exceeding 60 minsNum!
            if(minsNum > 59 && minsNum % 60 == 0)
            {
                hrsNum++;
                minsNum = 0;
            }
        }
        
    }
})(jQuery);
