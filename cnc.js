/* This file must be included on the main application page, served by the wireless CNC controller module. */
var cnc = cnc || new (function () {

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
    
    var _nextM3dCommand = function () {
        if (m3dqueue.length < 1) {
            m3dexecuting = false;
            return;
        }
        var cmd = m3dqueue.shift();
        console.log('--> send ' + cmd);
        _axis.X.setstepsize(STEPSIZE.HALF);
        _axis.Y.setstepsize(STEPSIZE.HALF);
        _axis.Z.setstepsize(STEPSIZE.HALF);
        cnc.connect().then(function(socket){
            socket.send(cmd);
        });
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

            if (!e.ctrlKey) { //only respond to keyboard CNC control shortcuts when CTRL key is held down
                return;
            }

            if (keymap[e.keyCode]) {
                return;
            }

            keymap[e.keyCode] = 1;

            var stepsize = e.altKey ? STEPSIZE.SIXTEENTH : STEPSIZE.WHOLE;

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
        $(btn).click(function (e) {
            var script = $('#userscript').value || $('#userscript').val();
            eval(script);
        });

        $('body').append(btn);

    };

    var _move3d = function (dx, dy, dz) {

        var msg = 'm3d.' +
            _axis.X.getvector(dx) + '.' +
            _axis.Y.getvector(dy) + '.' +
            _axis.Z.getvector(dz);

        m3dqueue.push(msg);

        if (!m3dexecuting) {
            m3dexecuting = true;
            _nextM3dCommand();
        }

    };

    var _socketMessageHandler = function(evt, flags, number) {
        if (evt.data == 'm3d.ok') {
            console.log('####### 3d command completed.  Sending next command ######');
            _nextM3dCommand();
        }
    };
    
    var _fulfillSocketPromise = function(resolve){
        if(_cncsocket.readyState===1){
            resolve(_cncsocket);
            return;
        }

        if(_cncsocket.readyState===2) { //closing
            _cncsocket.close();
        }
            
        if(_cncsocket.readyState===3) { //closed
            //create a new socket
            _cncsocket = _createWebSocket();
            _cncsocket.addEventListener("message", _socketMessageHandler);
        }
        
        //if we got here, the socket is opening
        setTimeout(_fulfillSocketPromise, 50, resolve);
    };
    
    var _promiseSocket = function () {
        return new Promise((resolve, reject) => {
            _fulfillSocketPromise(resolve);
        });
    }

    return new function () {

        var _this = this; //save the instance reference because 'this' will always change

        _this.axis = _axis;
        _this.move3d = _move3d;
        _this.connect = _promiseSocket;

        _init();

        _cncsocket.addEventListener("message", _socketMessageHandler);

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
