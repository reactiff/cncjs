var CncGlyph = function () {

    var _this;
        
    var _argchar = arguments[0];
    var _argstrokes = arguments[1];

    var _strokes = [];

    return new function () {
        _this = this;
        
        _this.char = _argchar;
        _this.strokewidth = 0.2;
        
        for (var i = 0; i < _argstrokes.length; i++) {
            var stroke = _argstrokes[i];
            stroke.setparent(_this);
            _strokes.push(stroke);
        }

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
        
        return _this;
    };
};
