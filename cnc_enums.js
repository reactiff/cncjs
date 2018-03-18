var CNCSTEPSIZE = { 
  WHOLE: '000', 
  HALF: '100', 
  QUARTER: '010', 
  EIGHTH: '110', 
  SIXTEENTH: '111' 
};

var CNCSPEED = { 
  FULL: { step: CNCSTEPSIZE.WHOLE, divisor: 16 }, 
  HALF: { step: CNCSTEPSIZE.HALF, divisor: 8 }, 
  QUARTER: { step: CNCSTEPSIZE.QUARTER, divisor: 4 }, 
  EIGHTH: { step: CNCSTEPSIZE.EIGHTH, divisor: 2 }, 
  SIXTEENTH: { step: CNCSTEPSIZE.SIXTEENTH, divisor: 1 } 
};

var CNCDIRECTION = { 
  FORWARD: 1, 
  REVERSE: 0 
};
