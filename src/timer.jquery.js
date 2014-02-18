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


    

    this.init();
		
	};

	/*
		Initialize the plugin with common properties
	*/
	jQueryTimer.prototype.init = function() {

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
    
    this.elType = this.$el.prop('tagName').toLowerCase();

    if(this.options.editable) this.initEditable();

	};

  jQueryTimer.prototype.start = function () {
    if(!this.isTimerRunning) {
      this.updateTimerDisplay();
      this.incrementTime(); //to avoid the 1 second gap that gets created if the seconds are not incremented
      this.startTimerInterval();
    }
  }

  jQueryTimer.prototype.pause = function () {
    clearInterval(this.timerId);
    this.isTimerRunning = false;
  }

  jQueryTimer.prototype.resume = function () {
    if(!this.isTimerRunning) this.startTimerInterval();
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
      self.pause();
    });

    this.$el.on('blur', function(){
      //get the value and update the number of seconds if necessary
      var timerDisplayStr;

      //remove any spaces while getting the string
      if(self.elType == 'input' || self.elType == 'textarea') timerDisplayStr = $(this).val().replace(/\s+/, '');
      else timerDisplayStr = $(this).html().replace(/\s+/, '');

      //check for seconds
      //check for minutes
      //check for hours

      var matchSeconds  = /\d+sec/,
          matchMinutes  = /\d+\:\d+min/,
          matchHours    = /\d+\:\d+\:\d+/;

      if(timerDisplayStr.match(matchSeconds)) {
        //extract the seconds from this
        self.secsNum = parseInt(timerDisplayStr.replace(/sec/, ''), 10) + 1;
        if (self.secsNum > 59) {
          self.secsNum = 00;
          self.minsNum++;
        }
      } else if(timerDisplayStr.match(matchMinutes)) {
        timerDisplayStr = timerDisplayStr.replace(/min/, '');
        var timerDisplayArr = timerDisplayStr.split(':');
        self.minsNum = parseInt(timerDisplayArr[0], 10);
        self.secsNum = parseInt(timerDisplayArr[1], 10) + 1;

        if (self.secsNum > 59) {
          self.secsNum = 00;
          self.minsNum++;
        }

        if (self.minsNum > 59) {
          self.minsNum = 00;
          self.hrsNum++;
        }

      } else if(timerDisplayStr.match(matchHours)) {
        var timerDisplayArr = timerDisplayStr.split(':');
        self.hrsNum = parseInt(timerDisplayArr[0], 10);
        self.minsNum = parseInt(timerDisplayArr[1], 10);
        self.secsNum = parseInt(timerDisplayArr[2], 10) + 1;

        if (self.secsNum > 59) {
          self.secsNum = 00;
          self.minsNum++;
        }

        if (self.minsNum > 59) {
          self.minsNum = 00;
          self.hrsNum++;
        }
      }
      self.resume();
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

    //assign the number of seconds to this element's data attribute for seconds
    this.$el.data('seconds', this.get_seconds());
  }
  
  jQueryTimer.prototype.timeToString = function () {
    this.secsStr = ((this.minsNum > 0 || this.hrsNum > 0) && this.secsNum < 10) ?  '0' + this.secsNum : this.secsNum;
    this.minsStr = (this.hrsNum > 0 && this.minsNum < 10) ?  '0' + this.minsNum : this.minsNum;
    this.hrsStr = this.hrsNum;
  }

  /*
    Get the timer's value in seconds
  */
  jQueryTimer.prototype.get_seconds = function () {
    return ((this.hrsNum*3600) + (this.minsNum*60) + this.secsNum);
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

    return this.each(function() {

      // only allow the plugin to be instantiated once
      if (!( $.data( this, 'plugin_' + pluginName ) instanceof jQueryTimer )) {
        $.data( this, 'plugin_' + pluginName, new jQueryTimer(this, options) );
      }

      var instance = $.data( this, 'plugin_' + pluginName );

      if(typeof options == 'string') {
        if(typeof instance[options] == 'function') {
          instance[options].call(instance); //passing in 'instance' to provide for the value of 'this' in the called function
        }
      }
    });
  }
  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////



 })(jQuery);