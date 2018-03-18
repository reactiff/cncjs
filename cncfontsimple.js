var CncFontSimple = cnc.FontSimple = function () {

    var _this;
    
    return new function () {

        _this = this;

        _this.glyphs = {};
        
        _this.glyphs['A'] = new cnc.Glyph('A',
            new Stroke(0, 6, 0, 1, 1, 0, 3, 0, 4, 1, 4, 6),
            new Stroke(0, 3, 4, 3)
        );

        _this.glyphs['B'] = new cnc.Glyph('B',
            new Stroke(1, 3, 3, 3, 4, 4, 4, 5, 3, 6, 0, 6, 0, 0, 3, 0, 4, 1, 4, 2)
        );

        _this.glyphs['C'] = new cnc.Glyph('C',
            new Stroke(4, 1, 3, 0, 1, 0, 0, 1, 0, 5, 1, 6, 3, 6, 4, 5)
        );

        _this.getglyph = (c) => {
            var g;
            if (c === ' ') {
                g = new cnc.Glyph();
                return ;
            }
            g = _this.glyphs[c];
            return g;
        };

        return _this;

    };
};
