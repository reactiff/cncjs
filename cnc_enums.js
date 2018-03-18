var CNCSTEPSIZE = { 
  WHOLE: '000', 
  HALF: '100', 
  QUARTER: '010', 
  EIGHTH: '110', 
  SIXTEENTH: '111' 
};

var CNCSPEED = { 
  FULL: { step: _this.STEPSIZE.WHOLE, divisor: 16 }, 
  HALF: { step: _this.STEPSIZE.HALF, divisor: 8 }, 
  QUARTER: { step: _this.STEPSIZE.QUARTER, divisor: 4 }, 
  EIGHTH: { step: _this.STEPSIZE.EIGHTH, divisor: 2 }, 
  SIXTEENTH: { step: _this.STEPSIZE.SIXTEENTH, divisor: 1 } 
};

var CNCDIRECTION = { 
  FORWARD: 1, 
  REVERSE: 0 
};
