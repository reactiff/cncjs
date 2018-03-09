// Your code here!
var LinearStage = function (options) {
    
    var _websock;
    
    var _name = options.name;

    var _pins = {
        ms1: options.pins.ms1,
        ms2: options.pins.ms2,
        ms3: options.pins.ms3,
        dir: options.pins.dir,
        pwm: options.pins.pwm
    };

    var _res = options.resolution;
    var _easing = '';
    var _moving = false;
    
    var _send = function (/* a comma separated argument list */) {
        var argarray = [].slice.apply(arguments).slice(0);
        _websock.send(argarray.join('.'));
    }

    var _readPin = function (pin) {
        //this needs to return a promise
    };

    var _writePin = function (pin, data) {
        _send('exe', 'pin', pin.toString().padStart(2, '0'), data);
    };

    var _move = function(mm, res){
        
        _moving = true;
        
        var numsteps = parseInt(res * mm);
        
        var dir = 1;
        if (numsteps < 0) {
            numsteps = Math.abs(numsteps);
            dir = 0;
        }

        _send('exe.pin.' + _pins.pwm + '.0');  //disengage
        _send('exe.pin.' + _pins.dir + '.' + dir);  //dir
        
        var stepsize = '111';
        
        _writePin(_pins.ms1, stepsize[0]);
        _writePin(_pins.ms2, stepsize[1]);
        _writePin(_pins.ms3, stepsize[2]);
        
        
        _send('mov.pin.' + _pins.pwm + '.001.001.' + numsteps);
        
        _moving = false;
    };
    
    var _onstartpwmclick = function (e) {

        var ondur = $(e).attr('ondurinput') ? $('#' + $(e).attr('ondurinput')).val().padStart(3, "0") : $(e).attr('ondur').padStart(3, "0") || ''; 
        var offdur = $(e).attr('offdurinput') ? $('#' + $(e).attr('offdurinput')).val().padStart(3, "0") : $(e).attr('offdur').padStart(3, "0") || '';
        
        var dist = $(e).attr('distinput') ? $('#' + $(e).attr('distinput')).val() : $(e).attr('distinput') || '';
        if(dist!=''){
            //move the distance using specified number of microsteps per mm
            var res = $(e).attr('resinput') ? $('#' + $(e).attr('resinput')).val() : $(e).attr('resinput') || '';    
            if(res==''){
                res = _res;
            }
            
            _move(dist, res);
            
            return;
        }

        if (ondur == '') ondur = '001';
        if (offdur == '') offdur = '001';

        _writePin(_pins.pwm, 0);  //disengage anything currently running on the pin

        var dir = $(e).attr('dir');

        _writePin(_pins.dir, dir);
            
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
        if (stepdivisor) {
            var stepsize;
            switch (parseInt(stepdivisor)) {
                case 1:
                    stepsize = '000';
                    break;
                case 2:
                    stepsize = '100';
                    break;
                case 4:
                    stepsize = '010';
                    break;
                case 8:
                    stepsize = '110';
                    break;
                case 16:
                    stepsize = '111';
                    break;
                default:
                    break;
            }
            _writePin(_pins.ms1, stepsize[0]);
            _writePin(_pins.ms2, stepsize[1]);
            _writePin(_pins.ms3, stepsize[2]);
        }

        _send('pwm', 'pin', _pins.pwm.toString().padStart(2, "0"), ondur, offdur, _easing);
    };

    var _onstoppwmclick = function (e) {
        
        if(_moving) return;
        
        if (_easing!='') {
            _send('pwm.pin', _pins.pwm.toString().padStart(2, "0"), '000.000', _easing);
        }
        else {
            _writePin(_pins.pwm, 0);
        }
    };

    return new function () {

        var self = this;

        _websock = new WebSocket('ws://' + window.location.hostname + ':81/');
        _websock.onopen = function (evt) { console.log(_name + ' websocket opened'); };
        _websock.onclose = function (evt) { console.log(_name + ' websocker closed'); alert(_name + ' WebSock closed!'); };
        _websock.onerror = function (evt) { console.log(_name + ' websocket error:\n\t' + evt); alert(_name + ' WebSock error!\n\t' + evt.toString()); }; 
        _websock.onmessage = function (evt) {
            console.log(_name + ' websocket message: ' + evt.data); var data = evt.data;
            //to do: Handle messages from CNC controller
        };

        self.engage = function (direction, stepsize) {

            _writePin(_pins.ms1, stepsize[0]);
            _writePin(_pins.ms2, stepsize[1]);
            _writePin(_pins.ms3, stepsize[2]);

            _writePin(_pins.dir, direction);
            
            _send('pwm', 'pin', _pins.pwm.toString().padStart(2, "0"), '001', '001', _easing);
        };

        self.disengage = function () {
            _writePin(_pins.pwm, 0);
        }

        self.move = _move;
        
        self.setorigin = function() {
        };

        self.onstartpwmclick = _onstartpwmclick;
        self.onstoppwmclick = _onstoppwmclick;

        return self;
    };
};

    
//Helpers
Number.prototype.forEach = function (callback) {
    if (this === 0) return false;
    for (var i = 0; i < this; i++) {
        callback(i);
    }
};

    
 
