var CncFontSimple = function () {

    var _this;
    
    return new function () {

        _this = this;

        _this.gliphs = {};
        
        _this.gliphs['A'] = new cnc.Gliph('A',
            new Stroke(0, 6, 0, 1, 1, 0, 3, 0, 4, 1, 4, 6),
            new Stroke(0, 3, 4, 3)
        );

        _this.gliphs['B'] = new cnc.Gliph('B',
            new Stroke(1, 3, 3, 3, 4, 4, 4, 5, 3, 6, 0, 6, 0, 0, 3, 0, 4, 1, 4, 2)
        );

        _this.gliphs['C'] = new cnc.Gliph('C',
            new Stroke(4, 1, 3, 0, 1, 0, 0, 1, 0, 5, 1, 6, 3, 6, 4, 5)
        );

        _this.getgliph = (c) => {
            var g;
            if (c === ' ') {
                g = new cnc.Gliph();
                return ;
            }
            g = _this.gliphs[c];
            return g;
        };

        return _this;

    };
};
