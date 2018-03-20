var LinearStage = function (options) {

    var _this;

    var _name = options.name;

    var _stepdivisor = 1;
    var _stepsize = '111';
    var _res = options.resolution;
    var _easing = '';
    var _inverted = options.inverted;

    var _executing = false;

    var _applyspeed = function(speed){
        var msg = 'axi.stp.' +
            _this.pins.ms1.toString().padStart(2, "0") + '.' +
            _this.pins.ms2.toString().padStart(2, "0") + '.' +
            _this.pins.ms3.toString().padStart(2, "0") + '.' +
            speed.step;
        cnc.connect().then(function (socket) {
            socket.send(cmd.message);
        });
    };
    
    var _send = function (/* a comma separated argument list */) {
        if (cnc.isoffline() || cnc.issimulation()) {
            return;
        }
        var argarray = [].slice.apply(arguments).slice(0);
        cnc.connect().then(function (ws) {
            ws.send(argarray.join('.'));
        });
    };

    var _writePin = function (pin, data, async) {
        _send('exe', 'pin', pin.toString().padStart(2, '0'), data, async);
    };

    var _setspeed = (speed) => {
        _stepdivisor = speed.divisor;
        _this.setstepsize(speed.step);
    };

    var _setstepsize = function (stepsize) {
        _stepsize = stepsize;
        _writePin(_this.pins.ms1, stepsize[0]);
        _writePin(_this.pins.ms2, stepsize[1]);
        _writePin(_this.pins.ms3, stepsize[2]);
    };

    var _adjustdir = (dir) => { return _inverted ? Math.pow(dir-1,2) : dir };

    var _move = function (mm, res) {
        _executing = true;
        var numsteps = parseInt(res * mm);
        var dir = 1;
        if (numsteps < 0) { numsteps = Math.abs(numsteps); dir = 0; }

        dir = _adjustdir(dir);

        _send('exe.pin.' + _this.pins.pwm.toString().padStart(2, '0') + '.0');  //disengage
        _send('exe.pin.' + _this.pins.dir.toString().padStart(2, '0') + '.' + dir);  //dir
        _setstepsize('111');
        _send('mov.pin.' + _this.pins.pwm.toString().padStart(2, '0') + '.001.001.' + numsteps);
    };

    var _onstartpwmclick = function (e) {

        var ondur = $(e).attr('ondurinput') ? $('#' + $(e).attr('ondurinput')).val().padStart(3, "0") : $(e).attr('ondur').padStart(3, "0") || '';
        var offdur = $(e).attr('offdurinput') ? $('#' + $(e).attr('offdurinput')).val().padStart(3, "0") : $(e).attr('offdur').padStart(3, "0") || '';

        var dist = $(e).attr('distinput') ? $('#' + $(e).attr('distinput')).val() : $(e).attr('distinput') || '';
        if (dist !== '') {
            //move the distance using specified number of microsteps per mm
            var res = $(e).attr('resinput') ? $('#' + $(e).attr('resinput')).val() : $(e).attr('resinput') || '';
            if (res === '') {
                res = _res;
            }

            _move(dist, res);

            return;
        }

        if (ondur === '') ondur = '001';
        if (offdur === '') offdur = '001';

        _writePin(_this.pins.pwm, 0);  //disengage anything currently running on the pin

        var dir = $(e).attr('dir');
        dir = _adjustdir(parseInt(dir));

        _writePin(_this.pins.dir, dir);

        //See if the element has any attributes pertaining to step size
        //1 represents FULL step.  Divisor acts as a denominator in the fraction, so 1/1, 1/2, 1/4 and so on...
        var stepdivisor = $(e).attr('stepdivisor') ?
            $(e).attr('stepdivisor') :
            $(e).attr('stepdivisorinput') ?
                $("input:radio[name='" + $(e).attr('stepdivisorinput') + "']:checked").val() :
                null;

        //set step size
        if (stepdivisor) {
            var codemap = { '1': '000', '2': '100', '4': '010', '8': '110', '16': '111' };
            _setstepsize(codemap[stepdivisor]);
        }

        _send('pwm', 'pin', _this.pins.pwm.toString().padStart(2, "0"), ondur, offdur, _easing);
    };

    var _onstoppwmclick = function (e) {

        if (_executing) return;

        if (_easing !== '') {
            _send('pwm.pin', _this.pins.pwm.toString().padStart(2, "0"), '000.000', _easing);
        }
        else {
            _writePin(_this.pins.pwm, 0);
        }
    };

    var _getvector = function (mm) {

        if (typeof mm === 'undefined') {
            mm = 0;
        }

        if (cnc.issimulation() || cnc.isoffline()) {
            if (mm == 0) {
                return '';
            }
            return _name + ": " + mm.toFixed(2) + 'mm ';
        }
        else {
            var dir = mm < 0 ? 0 : 1;
            dir = _adjustdir(parseInt(dir));

            var steps = parseInt((parseFloat(_res) / _stepdivisor) * Math.abs(mm)); //adjusted for speed by stepdivisor

            return _this.pins.pwm.toString().padStart(2, "0") + '.' +
                _this.pins.dir.toString().padStart(2, "0") + '.' +
                dir.toString() + '.' +
                steps.toString().padStart(7, "0");
        }

    };

    var _message = function (evt) { if (evt.data == 'ok') { _executing = false; } };

    var _setstepdivisor = function(divisor) {
        _stepdivisor = divisor;
    };

    return new function () {

        _this = this;

        _this.pins = {
            ms1: options.pins.ms1,
            ms2: options.pins.ms2,
            ms3: options.pins.ms3,
            dir: options.pins.dir,
            pwm: options.pins.pwm
        };

        _this.engage = function (direction, stepsize) {
            _setstepsize(stepsize);
            direction = _adjustdir(parseInt(direction));
            _writePin(_this.pins.dir, direction, 1);
            _send('pwm', 'pin', _this.pins.pwm.toString().padStart(2, "0"), '001', '001', 1);
        };

        _this.disengage = function () {
            _writePin(_this.pins.pwm, 0, 1);
        };

        _this.move = _move;
        _this.getvector = _getvector;
        _this.setstepsize = _setstepsize;
        _this.setorigin = function () { };
        _this.onstartpwmclick = _onstartpwmclick;
        _this.onstoppwmclick = _onstoppwmclick;
        _this.message = _message;
        _this.setspeed = _setspeed;

        _this.isinverted = function () {
            return _inverted;
        };

        _this.setstepdivisor = _setstepdivisor;
        
        return _this;
    };
};
