var CncInitAxes = function() { 
  
  return {
    X: new LinearStage({ name: "X axis", inverted: true, resolution: 2770, pins: { ms1: 0, ms2: 1, ms3: 2, dir: 3, pwm: 4 } }),

    Y: new LinearStage({ name: "Y axis", resolution: 5000, pins: { ms1: 8, ms2: 9, ms3: 10, dir: 11, pwm: 12 } }),

    Z: new LinearStage({ name: "Z axis", resolution: 2422, pins: { ms1: 24, ms2: 25, ms3: 26, dir: 27, pwm: 28 } })
  }
  
};
