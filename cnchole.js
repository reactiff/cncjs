var CncHole = function (id, diameter, x, y) {

    var _this;
    
    return new function () {
        _this = this;

        _this.id = id;
        _this.origin = new cnc.Point(x, y);
        
        _this.setparent = (stencil) => {
            _this.parentstencil = stencil;
        };

        _this.diameter = diameter;
        
        return _this;
    };
};
