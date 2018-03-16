var STEPSIZE = {
    WHOLE: '000',
    HALF: '100',
    QUARTER: '010',
    EIGHTH: '110',
    SIXTEENTH: '111'
};

var SPEED = {
    FULL: { step: STEPSIZE.WHOLE, divisor: 16 },
    HALF: { step: STEPSIZE.HALF, divisor: 8 },
    QUARTER: { step: STEPSIZE.QUARTER, divisor: 4 },
    EIGHTH: { step: STEPSIZE.EIGHTH, divisor: 2 },
    SIXTEENTH: { step: STEPSIZE.SIXTEENTH, divisor: 1 },
};
    
var DIRECTION = {
    FORWARD: 1,
    REVERSE: 0
};

/* This file must be included on the main application page, served by the wireless CNC controller module. */
var cnc = cnc || new (function () {

    var _this;
    
    var _offlinemode = false;
    
    var _canvas;
    var _drawingcontext;
    
    const _subscriptions = {};
    const _keymap = {};
    
    const m3dqueue = [];
    var m3dexecuting = false;
    
    var _setspeed = (speed) => {
        _axis.X.setspeed(speed);
        _axis.Y.setspeed(speed);
        _axis.Z.setspeed(speed);
    };
    
    var _nextM3dCommand = function () {
        if (m3dqueue.length < 1) {
            m3dexecuting = false;
            return;
        }
        var cmd = m3dqueue.shift();
       
        cnc.connect().then(function(socket){
            console.log(cmd.number + ': ' + cmd.message);
            socket.send(cmd);
        });
    };
    
    var _axis = {
        X: new LinearStage({ name: "X axis", resolution: 2770,
            pins: { ms1: 0, ms2: 1, ms3: 2, dir: 3, pwm: 4 } }),
        Y: new LinearStage({ name: "Y axis", resolution: 5000,
            pins: { ms1: 8, ms2: 9, ms3: 10, dir: 11, pwm: 12 } }),
        Z: new LinearStage({ name: "Z axis", resolution: 2422, 
            pins: { ms1: 24, ms2: 25, ms3: 26, dir: 27, pwm: 28 } })
    };

    var _init = function () {

        //bind keyboard shortcuts
        $(document).keydown(function (e) {

            if (!e.ctrlKey) { //only respond to keyboard CNC control shortcuts when CTRL key is held down
                return;
            }

            if (_keymap[e.keyCode]) { return; }
            _keymap[e.keyCode] = 1;

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

            _keymap[e.keyCode] = 0;

        });

        $($e('textarea#userscript.code')).appendTo('body');

        var btn = $e('button type="button"', 'Execute');
        $(btn).click(function (e) {
            var script = $('#userscript').value || $('#userscript').val();
            eval(script);
        });
        $('body').append(btn);
        
        var btn2 = $e('button type="button"', 'Commands');
        $(btn2).click(function (e) {
            var script = $('#userscript').value || $('#userscript').val();
            cnc.setoffline(true);
            eval(script);
        });
        $('body').append(btn);
        

    };

    var _msgno = 0;
    var _move = function (v) {
        
        var msg = 'm3d.' +
            _axis.X.getvector(v.x) + '.' +
            _axis.Y.getvector(v.y) + '.' +
            _axis.Z.getvector(v.z);
        
        var cmd = { number: ++_msgno, message: msg};
        m3dqueue.push(cmd);

        if(_offlinemode){
            $('body').append($e('div.command', $e('span.number',cmd.number), $e('span.message',cmd.message) ));
        }
        else if (!m3dexecuting) {
            m3dexecuting = true;
            _nextM3dCommand();
        }

        var _newpos = _this.pos.current.copy();
        _newpos.add(v);

        if (_canvas) {
            if (_this.pos.current.z > 0) {
                _drawingcontext.strokeStyle = "#ff0000";
                _drawingcontext.lineWidth = _this.options.tooldiameter * 100;
                _drawingcontext.moveTo(_this.pos.current.x * 100, _this.pos.current.y * 100);
                _drawingcontext.lineTo(_newpos.x * 100, _newpos.y * 100);
                _drawingcontext.stroke();
            }
        }
        _this.pos.current = _newpos;
    };
    
    var _socketMessageHandler = function(evt, flags, number) {
        
        console.log('[MSG] ' + evt.data);
        
        if(_subscriptions[evt.data]){
            _subscriptions[evt.data]();
        }
        if (evt.data == 'm3d.ok') {
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

        _this = this; //save the instance reference because 'this' will always change

        _this.axis = _axis;
        _this.connect = _promiseSocket;
        
        _this.options = {};

        _this.setspeed = _setspeed;
         
        _this.setoptions = (options) => {
            Object.keys(options).forEach(function (key) {
                _this.options[key] = options[key];
            });
        };

        _this.pos = {};
        _this.pos.current = new Vector(0,0,0); 
        
        _this.setorigin = () => {
            _this.pos.current = new Vector(0,0,0); 
        };
        
        var _drawingcontext;
        _this.setcanvas = (canvas) => {
            _canvas = canvas;

            _drawingcontext = _canvas.getContext("2d");
            _drawingcontext.scale(0.1, 0.1);
            
        };

        _this.endprogram = () => {
            var _drawingcontext = _canvas.getContext("2d");
            _drawingcontext.scale(0.1, 0.1);
        };
        _this.findsurface = () => {

            return new Promise((resolve, reject) => {
    
                if(_offlinemode){
                    resolve();
                    return;
                }
                
                cnc.connect().then((socket) => {

                    //setup a message listener and when a message with interrupt id int.surface is received, resolve
                    cnc.subscribe('int.surface', function () {
                        cnc.unsubscribe('int.surface');
                        resolve();
                    });

                    //set the direction for Z axis to move down its 1
                    socket.send('exe', 'pin', _axis.Z.pins.dir.toString().padStart(2, '0'), 1);

                    //setup pin 7 as input
                    socket.send('mod.pin.07.1'); //set pin 7 mode to input (easy to remember: 1 for [I]nput, 0 for [O]utput)

                    //setup an interrupt for condition when pin 7 becomes LOW, this will send a message 'int.surface'
                    //NOTE: Interrupt is automatically removed after condition is met, no need to remove it explicitly
                    socket.send('int.pin.07.0.surface'); //set up interrupt with id 'surface' for condition when pin 7 is low

                    var msg = 'm3d.' +
                        _axis.X.getvector(0) + '.' +
                        _axis.Y.getvector(0) + '.' +
                        _axis.Z.getvector(999);  //move z far down until the surface is reached, the interrupt should stop it from traveling too far
                    
                    socket.send(msg);


                });
            });
        }; //requires contact sensor
                
        _this.retract = () => {
            _this.movezto(-Math.abs(_this.options.retract));
        };      //raise the tool
        
        _this.tool = {
            engage: () => { console.log('tool power on');}
        };  //tool power on

        _this.move = _move;

        _this.cutin = () => { _this.movezto(_this.options.depth); };          //lower the tool to the cut depth, penetrating the surface
        _this.movex = (dx) => { _this.move(new Vector(dx, 0, 0)); };
        _this.movey = (dy) => { _this.move(new Vector(0, dy, 0)); };
        _this.movez = (dz) => { _this.move(new Vector(0, 0, dz)); };
        _this.moveto = (pos) => { _this.move(_this.pos.current.diff(pos)); };
        _this.movexto = (coord) => { _this.move(_this.pos.current.diffx(coord)); };
        _this.moveyto = (coord) => { _this.move(_this.pos.current.diffy(coord)); };
        _this.movezto = (coord) => { _this.move(_this.pos.current.diffz(coord)); };
        _this.savepos = (id, pos) => { _this.pos[id] = pos.copy(); };
        
        _this.subscribe = (id, cb) => { _subscriptions[id] = cb; };
        _this.unsubscribe = (id) => { _subscriptions[id] = null; };
        
        _this.setoffline = (flag) => {
            _offlinemode = flag;
        };
        
        _init();

        _cncsocket.addEventListener("message", _socketMessageHandler);

        return _this;

    };
})();




