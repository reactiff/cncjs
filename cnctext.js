var CncText = function (text, font, size) {

    var _this;

    var _text = text;
    var _font = font;
    var _size = size;

    return new function () {
        _this = this;

        _this.getglyphs = function () {
            var glyphs = [];
            for (var i = 0; i < _text.length; i++) {
                glyphs.push(_font.getglyph(_text[i]));
            }
            return glyphs;
        };

        return _this;
    };
}
