var CncDrillingMacro = function(stencil) {
                
    var drillholes = stencil.getholes();

    //1. foreach diameter
    var jobsbytoolsize = {};
    drillholes.forEach(function (hole) {
      
      if(!jobsbytoolsize.hasOwnProperty(hole)){
        
        jobsbytoolsize[hole.diameter] = {execute: null}; //job object with empty execute method
        
        //now we assign the method definition
        jobsbytoolsize[hole.diameter].execute = function () {

              var _diameter = hole.diameter;

              var holesfordiameter = drillholes.filter(h => h.diameter === _diameter);

              //position the tool over the first hole
              cnc.movexyto(holesfordiameter[0].origin);

              cnc.retract(50);

              if (!confirm('Tool change.\n\nPlease install a ' + _diameter + 'mm drill bit before pressing continue...')) {
                  return;
              }

              if (!confirm('Z axis calibration.\n\nPlease attach Surface Sensors to the platform and the drill bit before continuing...')) {
                  return;
              }

              cnc.findsurface().then(function () {

                  var _holes = holesfordiameter.slice(0);
                  for (var k = 0; k < holesfordiameter.length; k++) {

                      cnc.move(holesfordiameter[k].origin);

                      cnc.drill({
                          speed: cnc.SPEED.SIXTEENTH,
                          depth: 3.2,
                          retract: 3
                      });
                  }
                  cnc.milestone('diameter' + _diameter);
              });

          };
        }
    });

    var diameterkeys = Object.keys(jobsbytoolsize);
    diameterkeys.forEach(function (diameter, index, arr) {
        if (index == 0) {
            //start executing first batch immediately
            jobsbytoolsize[diameter].execute();
        }
        else{
            cnc.awaitMilestone('diameter' + diameterkeys[index - 1])
                .then(jobsbytoolsize[diameter].execute);
        }
    });

    //cnc.milestone('drilling');

    
};
