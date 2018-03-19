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

          
              cnc.setspeed(cnc.SPEED.FULL);
          
              cnc.retract(50);

              //position the tool over the first hole
              cnc.movexyto(holesfordiameter[0].origin, 'Hover first hole');
              

              if (!confirm('Tool change.\n\nPlease install a ' + _diameter + 'mm drill bit before pressing continue...')) {
                  return;
              }

              if (!confirm('Z axis calibration.\n\nPlease attach Surface Sensors to the platform and the drill bit before continuing...')) {
                  return;
              }

              cnc.findsurface().then(function () {
                
                cnc.setspeed(cnc.SPEED.FULL);
                cnc.retract('(After the surface is found)');
                
                var _holes = holesfordiameter.slice(0);
                
                for (var k = 0; k < _holes.length; k++) {
                    
                    cnc.movexyto(_holes[k].origin, 'Move XY to hole ' + _holes[k].id);

                    cnc.drill({
                        speed: cnc.SPEED.SIXTEENTH,
                        depth: 3.2,
                        retract: 2
                    }, 'Drill 3.2mm deel');
                  
                    cnc.retract('(after drilling)');
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
