var CncStroke = function () {

    var _this;

    var _args = [].slice.apply(arguments).slice(0);

    if (_args.length % 2 != 0) throw 'Coordinate parity error.  Stroke requires an even numberar of arguments, i.e. x1, y1, x2, y2 et.'

    const _origin = new cnc.Point();
    const _points = [];

    return new function () {
        _this = this;

        for (var i = 0; i < _args.length; i+=2) {
            if (i === 0) {
                _origin.x = _args[i];
                _origin.y = _args[i + 1];
            }
            else {
                _points.push(new cnc.Point(_args[i], _args[i+1]));
            }
        }

        _this.setparent = (gliph) => {
            _this.parentgliph = gliph;
        };

        _this.origin = function () {
            return _origin;
        };

        _this.startpos = function () {
            return new Vector(
                _origin.x * _this.parentgliph.strokewidth * _this.parentgliph.scale,
                _origin.y * _this.parentgliph.strokewidth * _this.parentgliph.scale
            );
        };

        _this.getpoints = () => { return _points; };

        _this.allpoints = () => {
            var allpoints = [];
            allpoints.push(_origin);
            _points.forEach(function (p) { allpoints.push(p);});
            return allpoints;
        };

        _this.getmoves = () => {
            var vectors = [];
            var lastpoint = _origin;
            _points.forEach(function (p) {
                vectors.push(new Vector(
                    (p.x - lastpoint.x) * _this.parentgliph.strokewidth * _this.parentgliph.scale,
                    (p.y - lastpoint.y) * _this.parentgliph.strokewidth * _this.parentgliph.scale
                ));
                lastpoint = p;
            });
            return vectors;
        };

        return _this;
    };
};
