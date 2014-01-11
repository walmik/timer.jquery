/*
 * =======================
 * jQuery Timer Plugin
 * =======================
 * 
 * Depends on:		jquery
 * 
 * --------
 * Summary:
 * --------
 * Start/Stop/Resume a time in any HTML element
 */

 (function($){

	var jQueryTimer = function(element, options) {
		var defaults = {
			action: 'start'
		};

		this.options = $.extend(defaults, options);
		this.$el = $(element);


    //setup
    this.secsNum           = 0;
    this.minsNum           = 0;
    this.hrsNum            = 0;
    this.secsStr           = "00";
    this.minsStr           = "00";
    this.hrsStr            = "00";
    this.timerId           = null;
    this.delay             = 1000;
    this.isTimerRunning    = false;

    if (this.options.seconds !== undefined) {
      this.hrsNum = Math.floor(this.options.seconds / 3600);
      this.minsNum = Math.floor((this.options.seconds - (this.hrsNum * 3600))/60);
      this.secsNum = this.options.seconds - (this.hrsNum * 3600) - (this.minsNum * 60);
      
      this.timeToString();
    }
		
		//this.init();
	};

	/*
		Initialize the plugin with common properties
	*/
	jQueryTimer.prototype.init = function() {
    
    
    switch(this.options.action)
    {
      case "start":
        if(!this.isTimerRunning) this.startTimer();
        break;
      
      case "pause":
        this.pauseTimer();
        break;
      
      case "resume":
        if(!this.isTimerRunning) this.startTimerInterval();
        break;
      
      case "reset":
        this.secsNum = 0;
        this.minsNum = 0;
        this.hrsNum = 0;
        break;
      
      case "get_seconds":
        return ((this.hrsNum*3600) + (this.minsNum*60) + this.secsNum - 1);
        break;
    }
	};

  jQueryTimer.prototype.pauseTimer = function () {
    clearInterval(this.timerId);
    this.isTimerRunning = false;
  }
  
  jQueryTimer.prototype.startTimer = function () {
    this.updateTimerDisplay();
    this.incrementTime(); //to avoid the 1 second gap that gets created if the seconds are not incremented
    this.startTimerInterval();
  }
  
  jQueryTimer.prototype.startTimerInterval = function () {
    var self = this;
    this.timerId = setInterval(function() { self.incrementTime() }, this.delay);
    this.isTimerRunning = true;
  }
  
  jQueryTimer.prototype.updateTimerDisplay = function () {
    if(this.hrsNum > 0) this.options.showHours = true;
    if(this.options.showHours) this.$el.html(this.hrsStr + ":" + this.minsStr + ":" + this.secsStr);
    else this.$el.html(this.minsStr + ":" + this.secsStr);
  }
  
  jQueryTimer.prototype.timeToString = function () {
    this.secsStr = this.secsNum < 10 ? "0" + this.secsNum : this.secsNum;
    this.minsStr = this.minsNum < 10 ? "0" + this.minsNum : this.minsNum;
    this.hrsStr = this.hrsNum < 10 ? "0" + this.hrsNum : this.hrsNum;
  }
  
  jQueryTimer.prototype.incrementTime = function () {
    this.timeToString();
    this.updateTimerDisplay();
    
    this.secsNum++;
    if(this.secsNum % 60 == 0) {
      this.minsNum++;
      this.secsNum = 0;
    }
    
    //handle time exceeding 60 minsNum!
    if(this.minsNum > 59 && this.minsNum % 60 == 0)
    {
      this.hrsNum++;
      this.minsNum = 0;
    }
  }
	

	///////////////////////////////////////////////////
	///////////////INITIALIZE THE PLUGIN///////////////
  var pluginName = 'timer';
	$.fn[pluginName] = function(options) {
    if (typeof options == 'string') {
      options = { action: options }
    }
    // only allow the plugin to be instantiated once
    if (!( this.data( 'plugin_' + pluginName ) instanceof jQueryTimer )) {
      this.data( 'plugin_' + pluginName, new jQueryTimer( this, options ) );
    }

    var instance = this.data( 'plugin_' + pluginName );
    instance.options.action = options.action;

    instance.init();

    return this;

	};
	////////////////////////////////////////////////////
	////////////////////////////////////////////////////


 })(jQuery);