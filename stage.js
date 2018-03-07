var LinearStage = function (options) {

    var name = options.name;
    
    var pins = {
      ms1: options.pins.ms1,
      ms2: options.pins.ms2,
      ms3: options.pins.ms3,
      dir: options.pins.dir,
      pwm: options.pins.pwm
    };
    
    var measurements = options.measurements;
    //var msmm = options.microstepspermm;
    
    return new function () {
        
        var self = this;
        
        self.movesteps = function (steps) {
            
        };

        return self;
    };
};
