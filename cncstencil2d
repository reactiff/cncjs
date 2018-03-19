var CncStencil2D = function () {

    var _this;
    
    var _strokes = [];
    var _holes = [];

    return new function () {
        _this = this;
        
        _this.strokewidth = 0.2;
                
        _this.widthinpoints = () => {
            if (_this.hasOwnProperty('customwidthinpoints')) {
                return _this.customwidthinpoints;
            }
            var points = 0;
            _strokes.forEach(function (s) {
                s.allpoints().forEach(function (p) {
                    if (p.x + 1 > points) {
                        points = p.x + 1;
                    }
                });
            });
            return points;
        };

        _this.heightinpoints = () => {
            if (_this.hasOwnProperty('customheightinpoints')) {
                return _this.customheightinpoints;
            }
            var points = 0;
            _strokes.forEach(function (s) {
                s.allpoints().forEach(function (p) {
                    if (p.y + 1 > points) {
                        points = p.y + 1;
                    }
                });
            });
            return points;
        };

        _this.width = () => {
            return _this.widthinpoints() * _this.strokewidth * _this.scale;
        };

        _this.height = () => {
            return _this.heightinpoints() * _this.strokewidth * _this.scale;
        }

        _this.getstrokes = () => {
            return _strokes;
        };

        _this.getholes = () => {
            return _holes;
        };

        _this.addstroke = (stroke) => {
            stroke.setparent(_this);
            _strokes.push(stroke);
        };

        _this.addhole = (hole) => {
            hole.setparent(_this);
            _holes.push(hole);
        };

        _this.get = (id) => {
            var item;
            _holes.forEach(function (hole) {
                if (h.id === id){
                    item = hole;
                    return false;
                }
            })
            return item;
        };

        return _this;
    };
};
