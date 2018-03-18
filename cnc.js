/* This file must be included on the main application page, served by the wireless CNC controller module. */
var cnc = new (function () {

    var _this;
    var _offlinemode = false;
    
    var _canvas;
    var _drawingcontext;
    
    const _subscriptions = {};
    const _keymap = {};
    
    const m3dqueue = [];
    var m3dexecuting = false;
          
    var _executeNextCommand = function () {
        if (m3dqueue.length < 1) {
            m3dexecuting = false;
            return;
        }
        var cmd = m3dqueue.shift();
        cnc.connect().then(function(socket){
            console.log(cmd.number + ': ' + cmd.message);
            socket.send(cmd.message);
        });
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
            _executeNextCommand();
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
    
    
    
    return new function () {

        _this = this; //save the instance reference because 'this' will always change

        //enums defined in cnc_enums.js
        _this.STEPSIZE = CNCSTEPSIZE;
        _this.SPEED = CNCSPEED;
        _this.DIRECTION = CNCDIRECTION;
        
        _this.notify = (msgdata) => {
            if(_subscriptions[msgdata]){
                _subscriptions[msgdata]();
            }
        };
        
        _this.connect = CncWSConnect;
        
        _this.options = {};

        _this.setspeed = (speed) => {
            Object.keys(_axis).forEach((key)=>{
                _axis[key].setspeed(speed);
            });
        };
         
        _this.setoptions = (options) => {
            Object.keys(options).forEach(function (key) {
                _this.options[key] = options[key];
            });
        };

        _this.pos = {};
        _this.pos.current = new Vector(0,0,0); 
        
        _this.setorigin = () => { _this.pos.current = new Vector(0,0,0); };
        
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
                
                cnc.setspeed(SPEED.QUARTER);
                
                cnc.connect().then((socket) => {

                    //setup a message listener and when a message with interrupt id int.surface is received, resolve
                    cnc.subscribe('int.surface', function () {
                        cnc.unsubscribe('int.surface');
                        
                        if (!_this.simulator) {
                            if(!_this.autosurfaceprobe){
                                if(!confirm('Surface reached!!!\n\nTO CONTINUE:\n1) Remove the probe from the tool\n2) Power up the tool\n\nBegin cutting?')){
                                    return;
                                }
                            }
                        }
                        
                        cnc.setorigin();
                        
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
                        _axis.Z.getvector(10);  //move z far down until the surface is reached, the interrupt should stop it from traveling too far
                    
                    socket.send(msg);


                });
            });
        }; //requires contact sensor
                
        _this.retract = () => { _this.movezto(-Math.abs(_this.options.retract)); };      //raise the tool
        
        _this.tool = { engage: () => { console.log('tool power on');} };  //tool power on

        _this.move = _move;

        _this.begincut = () => { _this.movezto(_this.options.depth); };          //lower the tool to the cut depth, penetrating the surface
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
        
        //new code
        _this.simulator = true;
        
        _this.Text = CncText;
        _this.FontSimple = CncFontSimple;
        _this.GlyphPoint = CncGlyphPoint;
        _this.Glyph = CncGlyph;
        _this.Stroke = CncStroke;

        var _axis = Axes; //defined in cnc_axes.js
        
        CncInitUI(); //defined in cnc_initui.js
        
        _this.initialize = () => {
            //set default options
            _this.setoptions({
                depth: 0.15,
                retract: 0.4,
                tooldiameter: 0.2
            });

            return new Promise((resolve, reject) => {
                _this.findsurface().then(resolve);
            });
        };
        
        //end new code
        
        _cncsocket.addEventListener("message", CncWSCommMessageHandler);
        
        return _this;

    };
})();




