var Vector = function (x, y, z) {

    var _this;
    
    /*
    Accepts a vector object and passess it through as a return object, adjusting the vector position
    */
    var _add = function (delta) {
        if (typeof delta.x !== 'undefined') _this.x += delta.x;
        if (typeof delta.y !== 'undefined') _this.y += delta.y;
        if (typeof delta.z !== 'undefined') _this.z += delta.z;
        return delta;
    };

    var _subtract = function (delta) {
        if (typeof delta.x !== 'undefined') _this.x -= delta.x;
        if (typeof delta.y !== 'undefined') _this.y -= delta.y;
        if (typeof delta.z !== 'undefined') _this.z -= delta.z;
        return delta;
    };

    var _diff = (v2) => {
        return new Vector(
            typeof v2.x !== 'undefined' ? v2.x - _this.x : 0,
            typeof v2.y !== 'undefined' ? v2.y - _this.y : 0,
            typeof v2.z !== 'undefined' ? v2.z - _this.z : 0
        );

    };

    var _diffx = (x) => { return new Vector(x - _this.x, 0, 0); };
    var _diffy = (y) => { return new Vector(0, y - _this.y, 0); };
    var _diffz = (z) => { return new Vector(0, 0, z - _this.z); };

    var _diffxy = (v2) => { 
        return new Vector(
            typeof v2.x !== 'undefined' ? v2.x - _this.x : 0,
            typeof v2.y !== 'undefined' ? v2.y - _this.y : 0,
            0
        ); 
    };

    var _copy = () => { return new Vector(_this.x, _this.y, _this.z); };

    /*
    Accepts a scalar number representing the change in x, adjusts the x position and returns a new vector object representing the change
    */
    var _addx = function (amount) {
        _this.x += amount;
        return new Vector(amount, 0, 0);
    };

    /*
    Accepts a scalar number representing the change in y, adjusts the y position and returns a new vector object representing the change
    */
    var _addy = function (amount) {
        _this.y += amount;
        return new Vector(0, amount, 0);
    };

    /*
    Accepts a scalar number representing the change in z, adjusts the z position and returns a new vector object representing the change
    */
    var _addz = function (amount) {
        _this.z += amount;
        return new Vector(0, 0, amount);
    };

    return new function () {

        _this = this;

        _this.x = x;
        _this.y = y;
        _this.z = z;

        _this.copy = _copy;

        _this.add = _add;
        _this.addx = _addx;
        _this.addy = _addy;
        _this.addz = _addz;

        _this.subtract = _subtract;

        _this.diff = _diff;
        _this.diffx = _diffx;
        _this.diffy = _diffy;
        _this.diffz = _diffz;
        _this.diffxy = _diffxy;

        return _this;
    };
};
