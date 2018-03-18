var CncText = function (text, font, size) {

    var _this;

    var _text = text;
    var _font = font;
    var _size = size;

    return new function () {
        _this = this;

        _this.getgliphs = function () {
            var gliphs = [];
            for (var i = 0; i < _text.length; i++) {
                gliphs.push(_font.getgliph(_text[i]));
            }
            return gliphs;
        };

        return _this;
    };
}
