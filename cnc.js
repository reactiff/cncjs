/* This file must be included on the main application page, served by the wireless CNC controller module. */

var cncjs = cncjs || new (function () {
    
  var websock;  //we use web sockets for fast communication with the controller
    
  var Axis = {
    x : { pins : { ms1 : 0, ms2 : 1, ms3 : 2, direction: 3, pwm: 4 }, measurements: { mspmm: 2800 } },
    y : { pins : { ms1 : 8, ms2 : 9, ms3 : 10, direction: 11, pwm: 12 }, measurements: { mspmm: 5000 }  },
    z : { pins : { ms1 : 24, ms2 : 25, ms3 : 26, direction: 27, pwm: 28 }, measurements: { mspmm: 1000 }  }
  };
  
  var Spindle = {};
  
  var init = function() {
      websock = new WebSocket('ws://' + window.location.hostname + ':81/');
      websock.onopen = function(evt) { console.log('websock open'); };
      websock.onclose = function(evt) { 
        console.log('websock close'); 
        alert('WebSock closed!');
      };
      websock.onerror = function(evt) { 
          console.log(evt); 
          alert('WebSock error!\n\t'+evt.toString());
      };
      websock.onmessage = function(evt) {
        console.log(evt);
        var data = evt.data;
       
        //to do: Handle messages from CNC controller
      };
    
      //bind keyboard shortcuts
      $("window").keydown(function(e) {
        var stepbits = '000'; //default is FULL step
        if(e.ctrlKey){
          if(e.shiftKey){ stepbits = '111'; //Ctrl + Shift for 1/16th step
          } else { stepbits = '010'; //Ctrl or Shift alone give Quarter step
          }
        } else if(e.shiftKey){ stepbits = '010';   //Ctrl or Shift alone give Quarter step }
                     
        if(e.keyCode == 37) { // left
          //move X axis left
          writePin($(e).attr('ms1'), stepbits[0]);
          writePin($(e).attr('ms2'), stepbits[1]);
          writePin($(e).attr('ms3'), stepbits[2]);
        }
  
        send('pwm', 'pin', pwmpin, ondur, offdur, $(e).attr('easing'));  
        }
        else if(e.keyCode == 38) { // up/away
          if(e.altKey) {
            //move Z axis UP
          }
          else{
            //move Y axis away
          }
        }
        else if(e.keyCode == 39) { // right
          //move X axis right
        }
        else if(e.keyCode == 40) { // down/towards
          if(e.altKey) {
            //move Z axis DOWN
          }
          else{
            //move Y axis towards
          }
        }
      });
    
    };
  
  var send = function(/* a comma separated argument list */){
    var argarray = [].slice.apply(arguments).slice(0);
    websock.send(argarray.join('.'));  
  }
  
  var readPin = function(pin) {
      //this needs to return a promise
    };
  
  var writePin = function(pin, data){ 
      send('exe', 'pin', pin.padStart(2,'0'), data);
    };
     
  var startPWM = function (e) {
    
    var ondur = $(e).attr('ondurinput') ? $('#'+$(e).attr('ondurinput')).val().padStart(3,"0") : $(e).attr('ondur').padStart(3,"0");
    var offdur = $(e).attr('offdurinput') ? $('#'+$(e).attr('offdurinput')).val().padStart(3,"0") : $(e).attr('offdur').padStart(3,"0");
    var pwmpin = e.getAttribute('pwmpin').padStart(2,"0");
    
    writePin(pwmpin, 0);  //disengage anything currently running on the pin
    
    var dirpin = $(e).attr('dirpin').padStart(2,"0"); 
    var dir = $(e).attr('dir'); 

    writePin(dirpin, dir);

    //See if the element has any attributes pertaining to step size
    //1 represents FULL step.  Divisor acts as a denominator in the fraction, so 1/1, 1/2, 1/4 and so on...
    var stepdivisor = 
                      $(e).attr('stepdivisor')            // if stepdivisor attribute is present...
                    ? 
                      $(e).attr('stepdivisor')            // then grab its value
                    :                                     // else...
                          $(e).attr('stepdivisorinput')   // if radio group name is specified
                        ? 
                                                          // then grab the value of the selected radio button
                          $("input:radio[name='" + $(e).attr('stepdivisorinput') + "']:checked").val()
    
                        : null;                           // otherwise return null so we know there was nothing specified
      
    //set step size
    if(stepdivisor){
      var stepbits;
      switch(parseInt(stepdivisor)){
        case 1:
          stepbits = '000';
          break;
        case 2:
          stepbits = '100';
          break;
        case 4:
          stepbits = '010';
          break;
        case 8:
          stepbits = '110';
          break;
        case 16:
          stepbits = '111';
          break;
        default:
          break;
      }
      writePin($(e).attr('ms1'), stepbits[0]);
      writePin($(e).attr('ms2'), stepbits[1]);
      writePin($(e).attr('ms3'), stepbits[2]);
    }
  
    send('pwm', 'pin', pwmpin, ondur, offdur, $(e).attr('easing'));  
  };
  
  var stopPWM = function(e) {
    if($(e).attr('easing')){
      send('pwm.pin', $(e).attr('pwmpin').padStart(2,"0"), '000.000', $(e).attr('easing'));  
    }
    else
    {
      writePin($(e).attr('pwmpin'), 0);  
    }
  };
  
    
  return new function () {
      
    var _this = this; //save the instance reference because 'this' will always change
   
    _this.readPin = readPin;
    _this.writePin = writePin;
    _this.startPWM = startPWM;
    _this.stopPWM = stopPWM;
    
    init();
      
    return _this;
      
  };
})();


function toggle(e) {
  if(e.innerHTML == 'Off'){
    cncjs.writePin(e.getAttribute('pin'), 1);
    e.innerHTML = 'On';
  }
  else {
    cncjs.writePin(e.getAttribute('pin'), 0);
    e.innerHTML = 'Off';
  }
}


function stepPWM(e) {
  var dirpin =$('#movedirpin').val().padStart(2,"0");
  var pwmpin =$('#movepwmpin').val().padStart(2,"0");

  var ondur = $('#moveondur').val().padStart(3,"0");
  var offdur = $('#moveoffdur').val().padStart(3,"0");
  
  var steps = parseInt($('#movesteps').val());
  if(!(steps!=0)){
    return;
  }
  var dir = 1;
  if(steps<0){
    steps = Math.abs(steps);
    dir = 0;
  }
  websock.send('exe.pin.' + pwmpin + '.0');  //disengage
  websock.send('exe.pin.' + dirpin + '.' + dir);  //dir
  websock.send('mov.pin.' + pwmpin + '.' + ondur + '.' + offdur + '.' + steps);  
}
function flashText(opt, cycle){
  cycle = cycle || 1;

  var curcol = opt.fgcol;

  if(cycle % 2 === 0){ //invert colors on even cycles
      curcol = opt.bgcol;
  }

  websock.send('txt.dsp.' + curcol + 
        '.' + opt.size + 
        '.' + opt.align + 
        '.' + opt.x.toString().padStart(3, '0') + 
        '.' + opt.y.toString().padStart(3, '0') + 
        '.' + opt.text);

  if(cycle<opt.num*2){
    setTimeout(flashText, opt.delayms, opt, cycle+1);
  }
  else
  {
    websock.send('clr.dsp');
  }
}
