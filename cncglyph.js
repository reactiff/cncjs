var CncGlyph = function () {

    var _this;
    
    var _strokes = [];
    var _args = [].slice.apply(arguments).slice(0);
    
    return new function () {
        _this = this;

        _this.char = _args[0];
        _this.strokewidth = 0.2;

        for (var i = 1; i < _args.length; i++) {
            var stroke = _args[i];
            stroke.setparent(_this);
            _strokes.push(stroke);
        }

        _this.widthinpoints = () => {
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
            return _this.widthinpoints() * _this.strokewidth;
        };

        _this.height = () => {
            return _this.heightinpoints() * _this.strokewidth;
        }

        _this.getstrokes = () => {
            return _strokes;
        };
        
        return _this;
    };
};
