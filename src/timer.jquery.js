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
			action: 'start',
      editable: true   //this will let users make changes to the time
		};

		this.options = $.extend(defaults, options);
		this.$el = $(element);


    //setup
    this.secsNum           = 0;
    this.minsNum           = 0;
    this.hrsNum            = 0;
    this.secsStr           = "0 sec";
    this.minsStr           = "";
    this.hrsStr            = "";
    this.timerId           = null;
    this.delay             = 1000;
    this.isTimerRunning    = false;

    if (this.options.seconds !== undefined) {
      this.hrsNum = Math.floor(this.options.seconds / 3600);
      this.minsNum = Math.floor((this.options.seconds - (this.hrsNum * 3600))/60);
      this.secsNum = this.options.seconds - (this.hrsNum * 3600) - (this.minsNum * 60);
      
      this.timeToString();
    }
		
	};

	/*
		Initialize the plugin with common properties
	*/
	jQueryTimer.prototype.init = function() {
    
    this.elType = this.$el.prop('tagName').toLowerCase();

    if(this.options.editable) this.initEditable();

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

  /*
    Allow users to click and edit the timer value by typing in
  */
  jQueryTimer.prototype.initEditable = function () {
    var self = this;
    this.$el.on('focus', function(){
      self.$el.timer('pause');
    });

    this.$el.on('blur', function(){
      self.$el.timer('resume');
    });
  }
  
  jQueryTimer.prototype.updateTimerDisplay = function () {
    //if(this.hrsNum > 0) this.options.showHours = true;
    /*if(this.options.showHours) this.$el.html(this.hrsStr + ":" + this.minsStr + ":" + this.secsStr);
    else this.$el.html(this.minsStr + ":" + this.secsStr);*/
    var displayStr;
    if(this.hrsNum == 0) {
      if(this.secsNum < 60 && this.minsNum == 0) displayStr = this.secsStr + ' sec';
      else displayStr = this.minsStr + ":" + this.secsStr + ' min';
    } else {
      displayStr = this.hrsStr + ':' + this.minsStr + ':' + this.secsStr;
    }

    if(this.elType == 'input' || this.elType == 'textarea') this.$el.val(displayStr);
    else this.$el.html(displayStr);
  }
  
  jQueryTimer.prototype.timeToString = function () {
    this.secsStr = (this.minsNum > 0 && this.secsNum < 10) ?  '0' + this.secsNum : this.secsNum;
    this.minsStr = (this.hrsNum > 0 && this.minsNum < 10) ?  '0' + this.minsNum : this.minsNum;
    this.hrsStr = this.hrsNum;
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