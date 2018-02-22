/*
  This file must be included on the main application page, served by the wireless CNC controller module.
*/

var websock;  //we use web sockets for fast communication with the controller

function start() {
  websock = new WebSocket('ws://' + window.location.hostname + ':81/');
  websock.onopen = function(evt) { console.log('websock open'); };
  websock.onclose = function(evt) { console.log('websock close'); };
  websock.onerror = function(evt) { console.log(evt); };
  websock.onmessage = function(evt) {
    console.log(evt);
    var e = document.getElementById('ledstatus');
    if (evt.data === 'ledon') {
      e.style.color = 'red';
    }
    else if (evt.data === 'ledoff') {
      e.style.color = 'black';
    }
    else {
      console.log('unknown event');
    }
  };
}
function toggle(e) {10
  if(e.innerHTML == 'Off'){
    websock.send('exe.pin.' + e.getAttribute('pin') + '.1');  
    e.innerHTML = 'On';
  }
  else {
    websock.send('exe.pin.' + e.getAttribute('pin') + '.0');  
    e.innerHTML = 'Off';
  }
}
function engagePWM(e) {
  var ondur = $(e).attr('ondurinput') ? 
              $('#'+$(e).attr('ondurinput')).val().padStart(3,"0") : 
              $(e).attr('ondur').padStart(3,"0");
              
  var offdur = $(e).attr('offdurinput') ? 
              $('#'+$(e).attr('offdurinput')).val().padStart(3,"0") : 
              $(e).attr('offdur').padStart(3,"0");

  
  var stepdivisor =   $(e).attr('stepdivisor') 
                    ? $(e).attr('stepdivisor') 
                    : (
                        $(e).attr('stepdivisorinput') 
                      ? $("input:radio[name='" + $(e).attr('stepdivisorinput') + "']:checked").val()
                      : null
                    );
  
  var pwmpin = e.getAttribute('pwmpin').padStart(2,"0");
  websock.send('exe.pin.' + pwmpin + '.0');  //disengage
  websock.send('exe.pin.' + e.getAttribute('dirpin').padStart(2,"0") + '.' + e.getAttribute('dir'));  //dir

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
    websock.send('exe.pin.' + $(e).attr('ms1').padStart(2,"0") + '.' + stepbits[0]);
    websock.send('exe.pin.' + $(e).attr('ms2').padStart(2,"0") + '.' + stepbits[1]);
    websock.send('exe.pin.' + $(e).attr('ms3').padStart(2,"0") + '.' + stepbits[2]);
  }
  
  
  websock.send('pwm.pin.' + pwmpin + '.' + ondur + '.' + offdur + "." + $(e).attr('easing'));  
}
function disengagePWM(e) {
  if($(e).attr('easing').length>0){
    websock.send('pwm.pin.' + e.getAttribute('pwmpin').padStart(2,"0") + '.000.000.' + $(e).attr('easing'));  
  }
  else
  {
    websock.send('exe.pin.' + e.getAttribute('pwmpin').padStart(2,"0") + '.0');  
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
