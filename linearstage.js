var LinearStage = function (options) {

    var _name = options.name;

    var _pins = {
        ms1: options.pins.ms1,
        ms2: options.pins.ms2,
        ms3: options.pins.ms3,
        dir: options.pins.dir,
        pwm: options.pins.pwm
    };

    var _stepsize = '111';
    var _res = options.resolution;
    var _easing = '';
    
    var _executing = false;
    
    var _send = function (/* a comma separated argument list */) {
        var argarray = [].slice.apply(arguments).slice(0);
        cnc.connect().then(function(ws){
            ws.send(argarray.join('.'));    
        });
    }

    var _writePin = function (pin, data) {
        _send('exe', 'pin', pin.toString().padStart(2, '0'), data);
    };

    var _setstepsize = function(stepsize){
        _stepsize = stepsize;
        _writePin(_pins.ms1, stepsize[0]);
        _writePin(_pins.ms2, stepsize[1]);
        _writePin(_pins.ms3, stepsize[2]);  
    };

    var _move = function (mm, res) {
        _executing = true;
        var numsteps = parseInt(res * mm);
        var dir = 1;
        if (numsteps < 0) { numsteps = Math.abs(numsteps); dir = 0; }
        _send('exe.pin.' + _p.pwm.toString().padStart(2, '0') + '.0');  //disengage
        _send('exe.pin.' + _p.dir.toString().padStart(2, '0') + '.' + dir);  //dir
        _setstepsize('111');
        _send('mov.pin.' + _p.pwm.toString().padStart(2, '0') + '.001.001.' + numsteps);
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
            var codemap = { '1': '000', '2': '100', '4': '010', '8': '110', '16': '111' };
            _setstepsize(codemap[stepdivisor]);
        }

        _send('pwm', 'pin', _pins.pwm.toString().padStart(2, "0"), ondur, offdur, _easing);
    };

    var _onstoppwmclick = function (e) {
        
        if(_executing) return;
        
        if (_easing!='') {
            _send('pwm.pin', _pins.pwm.toString().padStart(2, "0"), '000.000', _easing);
        }
        else {
            _writePin(_pins.pwm, 0);
        }
    };

    var _getvector = function(mm){
        var dir = mm<0 ? 0 : 1;
        var steps = parseInt(parseFloat(_res) * Math.abs(mm));
        
        return _pins.pwm.toString().padStart(2, "0") + '.' +
               _pins.dir.toString().padStart(2, "0") + '.' +
               dir.toString() + '.' +
               steps.toString().padStart(7, "0");
        
    };
    
    var _message = function (evt) { if (evt.data == 'ok') { _executing = false; } };

    
    return new function () {

        var self = this;

        self.engage = function (direction, stepsize) {
            _setstepsize(stepsize);
            _writePin(_pins.dir, direction);
            _send('pwm', 'pin', _pins.pwm.toString().padStart(2, "0"), '001', '001', _easing);
        };

        self.disengage = function () {
            _writePin(_pins.pwm, 0);
        }

        self.move = _move;
        self.getvector = _getvector;
        self.setstepsize = _setstepsize;
        self.setorigin = function() { };
        self.onstartpwmclick = _onstartpwmclick;
        self.onstoppwmclick = _onstoppwmclick;
        self.message = _message;
        
        return self;
    };
};

 
