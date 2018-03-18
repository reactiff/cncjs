var CncText = function (text, font, scale) {

    var _this;

    var _text = text;
    var _font = font;
    var _scale = scale;

    return new function () {
        _this = this;

        _this.getglyphs = function () {
            var glyphs = [];
            for (var i = 0; i < _text.length; i++) {
                var g = _font.getglyph(_text[i]);
                g.scale = _scale;
                glyphs.push(g);
            }
            return glyphs;
        };

        return _this;
    };
}
