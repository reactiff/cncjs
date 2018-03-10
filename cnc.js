/* This file must be included on the main application page, served by the wireless CNC controller module. */

var cncjs = cncjs || new (function () {

    var STEPSIZE = {
        WHOLE: '000',
        HALF: '100',
        QUARTER: '010',
        EIGHTH: '110',
        SIXTEENTH: '111'
    };

    var DIRECTION = {
        FORWARD: 1,
        REVERSE: 0
    };
    
    var m3dqueue = new Array();
    var m3dexecuting = false;
    
    var _websock;
    var _websockconnected = false;;
    
    var _nextM3dCommand = function(){
        if(m3dqueue.length<1){
            m3dexecuting = false;
            return;
        }
        
        var cmd = m3dqueue.shift();
        console.log('--> send ' + cmd); 
        
        
        _axis.X.setstepsize(STEPSIZE.SIXTEENTH);
        _axis.Y.setstepsize(STEPSIZE.SIXTEENTH);
        _axis.Z.setstepsize(STEPSIZE.SIXTEENTH);
        
        _m3dws.send(cmd);
    };
        
    _m3dws.onopen = function (evt) { console.log('M3D websocket opened'); };
    _m3dws.onclose = function (evt) { console.log('M3D websocket closed'); alert('M3D WebSock closed!'); };
    _m3dws.onerror = function (evt) { console.log('M3D websocket error:\n\t' + evt); alert('M3D WebSock error!\n\t' + evt.toString()); }; 
    _m3dws.onmessage = function (evt) {
        if(evt.data=='m3d.ok'){
            console.log('m3d command completed.  Sending next command'); 
            _nextM3dCommand();
        }
    };
    
    
    
        
    var _axis = {
        X: new LinearStage({
            name: "X axis",
            resolution: 2770,
            pins: {
                ms1: 0,
                ms2: 1,
                ms3: 2,
                dir: 3,
                pwm: 4
            }
        }),
        Y: new LinearStage({
            name: "Y axis",
            resolution: 5000,
            pins: {
                ms1: 8,
                ms2: 9,
                ms3: 10,
                dir: 11,
                pwm: 12
            }
        }),
        Z: new LinearStage({
            name: "Z axis",
            resolution: 4000,
            pins: {
                ms1: 24,
                ms2: 25,
                ms3: 26,
                dir: 27,
                pwm: 28
            }
        })
    };
    
    var keymap = {};
    
    var _init = function () {
        
        //bind keyboard shortcuts
        $(document).keydown(function (e) {
            
            if(!e.ctrlKey){ //only respond to keyboard CNC control shortcuts when CTRL key is held down
                return;
            }
            
            if(keymap[e.keyCode]){
                return;
            }
            
            keymap[e.keyCode] = 1;
            
            var stepsize = e.ctrlKey ? STEPSIZE.SIXTEENTH : STEPSIZE.WHOLE;

            console.log('keydown > key: ' + e.keyCode);
            
            if (e.keyCode == 37) { // left
                _axis.X.engage(DIRECTION.FORWARD, stepsize);
            }
            else if (e.keyCode == 38) { // up/away
                if (e.shiftKey) {
                    _axis.Z.engage(DIRECTION.REVERSE, stepsize);
                }
                else {
                    _axis.Y.engage(DIRECTION.REVERSE, stepsize);
                }
            }
            else if (e.keyCode == 39) { // right
                _axis.X.engage(DIRECTION.REVERSE, stepsize);
            }
            else if (e.keyCode == 40) { // down/towards
                if (e.shiftKey) {
                    _axis.Z.engage(DIRECTION.FORWARD, stepsize);
                }
                else {
                    _axis.Y.engage(DIRECTION.FORWARD, stepsize);
                }
            }
        });

        $(document).keyup(function (e) {
            
            console.log('keyup > key: ' + e.keyCode);
            
            if (e.keyCode == 37) { // left
                _axis.X.disengage();
            }
            else if (e.keyCode == 38) { // up/away
                _axis.Y.disengage();
                _axis.Z.disengage();
            }
            else if (e.keyCode == 39) { // right
                _axis.X.disengage();
            }
            else if (e.keyCode == 40) { // down/towards
                _axis.Y.disengage();
                _axis.Z.disengage();
            }
            
            keymap[e.keyCode] = 0;
            
        });

        $($e('textarea#userscript.code')).appendTo('body');
        
        var btn = $e('button type="button"', 'Execute');
        $(btn).click(function(e){
            var script = $('#userscript').value || $('#userscript').val();
            eval(script);
        });
        
        $('body').append(btn);
        
    };
    
    var _move3d = function(dx, dy, dz){
        
        var msg = 'm3d.' +
                  _axis.X.getvector(dx) + '.' +
                  _axis.Y.getvector(dy) + '.' +
                  _axis.Z.getvector(dz);
        
        m3dqueue.push(msg);
                
        if(!m3dexecuting){
            m3dexecuting = true;
            _nextM3dCommand();
        }
        
    };
    
    var _connect = function() {
      return new Promise((resolve, reject) => {
        if(_websockconnected){
            resolve(_websock);
        }else{
            if(!_websock){
                _websock = new WebSocket('ws://' + window.location.hostname + ':81/');    
            }
            else {
                _websock.removeAllListeners();
                _websock.open('ws://' + window.location.hostname + ':81/');    
            }
            
            _websock.onopen = function(e){ 
                _websockconnected = true;
                resolve(_websock);
             };
            
            _websock.onmessage = function(data,flags,number){
                _axis.X.socketmessage(data, flags, number);
                _axis.Y.socketmessage(data, flags, number);
                _axis.Z.socketmessage(data, flags, number);
            };
            
            _websock.onclose = function(e){ 
                _websockconnected = false;
                console.log('Websocket closed');
             };
            
            _websock.onerror = function(e){ 
                _websockconnected = false;
                console.err(arguments);
             };
        }
      });
    }

   

    return new function () {

        var _this = this; //save the instance reference because 'this' will always change

        _this.axis = _axis;
        _this.move3d = _move3d;
        _this.connect = _connect;

        _init();

        return _this;

    };
})();


// function toggle(e) {
//     if (e.innerHTML == 'Off') {
//         cncjs.writePin(e.getAttribute('pin'), 1);
//         e.innerHTML = 'On';
//     }
//     else {
//         cncjs.writePin(e.getAttribute('pin'), 0);
//         e.innerHTML = 'Off';
//     }
// }


// function stepPWM(e) {
//     var dirpin = $('#movedirpin').val().padStart(2, "0");
//     var pwmpin = $('#movepwmpin').val().padStart(2, "0");

//     var ondur = $('#moveondur').val().padStart(3, "0");
//     var offdur = $('#moveoffdur').val().padStart(3, "0");

//     var steps = parseInt($('#movesteps').val());
//     if (!(steps != 0)) {
//         return;
//     }
//     var dir = 1;
//     if (steps < 0) {
//         steps = Math.abs(steps);
//         dir = 0;
//     }
//     websock.send('exe.pin.' + pwmpin + '.0');  //disengage
//     websock.send('exe.pin.' + dirpin + '.' + dir);  //dir
//     websock.send('mov.pin.' + pwmpin + '.' + ondur + '.' + offdur + '.' + steps);
// }
// function flashText(opt, cycle) {
//     cycle = cycle || 1;

//     var curcol = opt.fgcol;

//     if (cycle % 2 === 0) { //invert colors on even cycles
//         curcol = opt.bgcol;
//     }

//     websock.send('txt.dsp.' + curcol +
//         '.' + opt.size +
//         '.' + opt.align +
//         '.' + opt.x.toString().padStart(3, '0') +
//         '.' + opt.y.toString().padStart(3, '0') +
//         '.' + opt.text);

//     if (cycle < opt.num * 2) {
//         setTimeout(flashText, opt.delayms, opt, cycle + 1);
//     }
//     else {
//         websock.send('clr.dsp');
//     }
// }
