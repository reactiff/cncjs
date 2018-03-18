var CncFontSimple = function () {

    var _this;

    var char = function()  {

        const args = Array.from(arguments);
        
        var c = args[0];

        _this.glyphs.push(new cnc.Glyph(c, args.slice(1)));

    };

    return new function () {

        _this = this;

        _this.glyphs = [];


        //UPPER CASE
        char('A',
            new cnc.Stroke(0, 6, 0, 1, 1, 0, 3, 0, 4, 1, 4, 6),
            new cnc.Stroke(0, 3, 4, 3)
        );
                
        char('B',
            new cnc.Stroke(1, 3, 3, 3, 4, 4, 4, 5, 3, 6, 0, 6, 0, 0, 3, 0, 4, 1, 4, 2, 3, 3)
        );

        char('C',
            new cnc.Stroke(4, 1, 3, 0, 1, 0, 0, 1, 0, 5, 1, 6, 3, 6, 4, 5)
        );

        char('D',
            new cnc.Stroke(0, 6, 0, 0, 3, 0, 4, 1, 4, 5, 3, 6, 0, 6)
        );

        char('E',
            new cnc.Stroke(3, 0, 0, 0, 0, 6, 4, 6),
            new cnc.Stroke(3,3,0,3)
        );

        char('F',
            new cnc.Stroke(3, 0, 0, 0, 0, 6),
            new cnc.Stroke(3, 3, 0, 3)
        );

        char('G',
            new cnc.Stroke(4, 1, 3, 0, 1, 0, 0, 1, 0, 5, 1, 6, 3, 6, 4, 3, 2, 3)
        );

        char('H',
            new cnc.Stroke(0, 0, 0, 6),
            new cnc.Stroke(4, 6, 4, 0),
            new cnc.Stroke(4, 3, 0, 3)
        );

        char('I',
            new cnc.Stroke(1, 0, 3, 0),
            new cnc.Stroke(2, 0, 2, 6),
            new cnc.Stroke(1, 6, 3, 6)
        );

        char('J',
            new cnc.Stroke(2, 0, 4, 0, 4, 5, 3, 6, 1,6, 0,5),
        );

        char('K',
            new cnc.Stroke(0, 0, 0, 6),
            new cnc.Stroke(4, 6, 1, 3, 4, 0)
        );

        char('L',
            new cnc.Stroke(0, 0, 0, 6, 4, 6),
        );

        char('M',
            new cnc.Stroke(0,6, 0,0, 2,2, 4,0, 4,6)
        );

        char('N',
            new cnc.Stroke(0, 6, 0, 0, 4, 4),
            new cnc.Stroke(4, 6, 4, 0)
        );

        char('O',
            new cnc.Stroke(1,0, 3,0, 4,1, 4,5, 3,6, 1,6, 0,5, 0,1, 1,0)
        );

        char('P',
            new cnc.Stroke(0,6, 0,0, 3,0, 4,1, 4,2, 3,3, 0,3)
        );

        char('Q',
            new cnc.Stroke(1, 0, 3, 0, 4, 1, 4, 5, 3, 6, 1, 6, 0, 5, 0, 1, 1, 0),
            new cnc.Stroke(2, 4, 3, 5)
        );

        char('R',
            new cnc.Stroke(0, 6, 0, 0, 3, 0, 4, 1, 4, 2, 3, 3, 0, 3),
            new cnc.Stroke(2, 4, 4, 6)
        );

        char('S',
            new cnc.Stroke(4, 1, 3, 0, 1, 0, 0, 1, 0, 2, 1, 3, 3, 3, 4, 4, 4, 5, 3, 6, 1, 6, 0, 5)
        );

        char('T',
            new cnc.Stroke(0, 0, 4, 0),
            new cnc.Stroke(2, 0, 2, 6)
        );

        char('U',
            new cnc.Stroke(0, 0, 0, 5, 1, 6, 3, 6, 4, 5, 4, 0),
        );

        char('V',
            new cnc.Stroke(0, 0, 0, 4, 2, 6, 4, 4, 4, 0)
        );

        char('W',
            new cnc.Stroke(0, 0, 0, 6, 2, 4, 4, 6, 4, 0)
        );

        char('X',
            new cnc.Stroke(0, 0, 0, 1, 4, 5, 4, 6),
            new cnc.Stroke(4, 0, 4, 1, 0, 5, 0, 6)
        );

        char('Y',
            new cnc.Stroke(0, 0, 2, 2, 4, 0),
            new cnc.Stroke(2, 2, 2, 6)
        );

        char('Z',
            new cnc.Stroke(0, 0, 4, 0, 0, 6, 4, 6)
        );

        //lower case

        char('a',
            new cnc.Stroke(4, 4, 1, 4, 0,5, 1, 6, 4, 6,4,3, 3,2, 1,2)
        );

        char('b',
            new cnc.Stroke(0, 0, 0, 6, 3, 6, 4, 5, 4, 3, 3, 2, 0, 2)
        );

        char('c',
            new cnc.Stroke(4, 2, 1, 2, 0, 3, 0, 5, 1, 6, 4, 6)
        );

        char('d',
            new cnc.Stroke(4, 0, 4, 6, 1, 6, 0, 5,0, 3, 1,2,4, 2)
        );

        char('e',
            new cnc.Stroke(0, 4, 4,4,4,3,3,2,1,2,0,3,0,5,1,6,3,6)
        );

        char('f',
            new cnc.Stroke(1, 6, 1, 1, 2, 0),
            new cnc.Stroke(0,2,2,2)
        );

        char('g',
            new cnc.Stroke(4, 1, 3, 2, 1, 2, 0, 3, 0, 5, 1, 6, 3, 6, 4, 5, 4, 3, 3, 2),
            new cnc.Stroke(1,6,1,7,0,8,0,9,1,10,3,10,4,9,3,8,2,8)
        );

        char('h',
            new cnc.Stroke(0, 0, 0, 6),
            new cnc.Stroke(0, 2, 3, 2, 4,3,4,6),
        );

        char('i',
            new cnc.Stroke(1, 6, 1, 2, 0, 2),
            new cnc.Stroke(1, 0),
        );

        char('j',
            new cnc.Stroke(0,7, 1, 6, 1, 2, 0, 2),
            new cnc.Stroke(1, 0),
        );

        char('k',
            new cnc.Stroke(0, 0, 0, 6),
            new cnc.Stroke(3, 2, 1, 4, 3, 6),
        );

        char('l',
            new cnc.Stroke(0,0,1,0,1,6)
        );

        char('m',
            new cnc.Stroke(0, 6, 0, 2, 3, 2, 4, 3, 4, 6),
            new cnc.Stroke(2, 6, 2,2)
        );

        char('n',
            new cnc.Stroke(0, 6, 0, 2, 3, 2, 4, 3, 4, 6)
        );

        char('o',
            new cnc.Stroke(3, 6, 1, 6, 0, 5, 0,3,1,2,3,2,4,3,4,5, 3,6 )
        );

        char('p',
            new cnc.Stroke(0, 10, 0,2, 3,2, 4,3, 4,5, 3,6, 0, 6)
        );

        char('q',
            new cnc.Stroke(3, 6, 1, 6, 0, 5, 0, 3, 1, 2, 3, 2, 4, 3, 4, 10)
        );

        char('r',
            new cnc.Stroke(0, 6, 0,2, 3,2, 4,3)
        );

        char('s',
            new cnc.Stroke(3,2,1,2,0,3,1,4,3,4,4,5,3,6,1,6)
        );

        char('t',
            new cnc.Stroke(0, 3, 2, 3),
            new cnc.Stroke(1, 2, 1,5, 2,6)
        );

        char('u',
            new cnc.Stroke(0,2, 0,5,1,6,4,6,4,2)
        );

        char('v',
            new cnc.Stroke(0,2,0,4,2,6,4,4,4,2)
        );

        char('w',
            new cnc.Stroke(0,2,0,5,1,6,2,5,2,3,2,5,3,6,4,5,4,2)
        );

        char('x',
            new cnc.Stroke(0, 2, 4, 6),
            new cnc.Stroke(4, 2, 0, 6),
        );

        char('y',
            new cnc.Stroke(0, 2, 0, 4, 2, 6),
            new cnc.Stroke(4, 2, 4, 4, 0, 8)
        );

        char('z',
            new cnc.Stroke(0, 2, 4, 2, 0, 6, 4, 6)
        );


        //digits

        char('0',
            new cnc.Stroke(1, 0, 3, 0, 4, 1, 4, 5, 3, 6, 1, 6, 0, 5, 0, 1, 1, 0),
            new cnc.Stroke(3, 2, 1, 4)
        );

        char('1',
            new cnc.Stroke(0, 2, 2, 0, 2, 6),
            new cnc.Stroke(0, 6, 4, 6)
        );

        char('2',
            new cnc.Stroke(0, 1, 1, 0, 3, 0, 4, 1, 4, 2, 0, 6, 4, 6)
        );

        char('3',
            new cnc.Stroke(0, 1, 1, 0, 3, 0, 4, 1, 4, 2, 3, 3, 2, 3, 3, 3, 4, 4, 4, 5, 3, 6, 1, 6, 0, 5)
        );

        char('4',
            new cnc.Stroke(4, 4, 0, 4, 4, 0, 4, 6)
        );

        char('5',
            new cnc.Stroke(4, 0, 0, 0, 0, 2, 3, 2, 4, 3, 4, 5, 2, 6, 1, 6, 0, 5)
        );

        char('6',
            new cnc.Stroke(4, 1, 3, 0, 1, 0, 0, 1, 0, 5, 1, 6, 3, 6, 4, 5, 4,4, 3,3, 0, 3)
        );

        char('7',
            new cnc.Stroke(0, 0, 4, 0, 4, 1, 2, 3, 2, 6)
        );

        char('8',
            new cnc.Stroke(1, 3, 0, 2, 0, 1, 1, 0, 3, 0, 4, 1, 4, 2, 3, 3, 1, 3, 0, 4, 0, 5, 1, 6, 3, 6, 4, 5, 4, 4, 3, 3)
        );

        char('9',
            new cnc.Stroke(4, 3, 1, 3, 0, 2, 0, 1, 1, 0, 3, 0, 4, 1, 4, 5, 3, 6, 1, 6, 0, 5)
        );

        //punctuation

        char('.',
            new cnc.Stroke(1, 6)
        );

        char(',',
            new cnc.Stroke(1, 6, 0, 7)
        );

        char(':',
            new cnc.Stroke(1, 1),
            new cnc.Stroke(1, 5)
        );

        char(';',
            new cnc.Stroke(1, 1),
            new cnc.Stroke(1, 5, 0, 6)
        );

        char('?',
            new cnc.Stroke(0, 1, 1, 0, 3, 0, 4, 1, 4, 2, 2, 4),
            new cnc.Stroke(2, 6)
        );

        char('!',
            new cnc.Stroke(2, 0, 2, 4),
            new cnc.Stroke(2, 6)
        );

        char('"',
            new cnc.Stroke(0, 0, 0, 1),
            new cnc.Stroke(2, 0, 2, 1)
        );

        char('\'',
            new cnc.Stroke(0, 0, 0, 1)
        );

        char('/',
            new cnc.Stroke(2, 0, 0, 6)
        );

        char('\\',
            new cnc.Stroke(0,0, 2, 6)
        );

        char('|',
            new cnc.Stroke(0, 0, 0, 6)
        );

        char('[',
            new cnc.Stroke(1, 0, 0, 0, 0, 6, 1, 6)
        );

        char(']',
            new cnc.Stroke(0, 0, 1, 0, 1, 6, 0, 6)
        );

        char('{',
            new cnc.Stroke(2, 0, 1, 1, 1, 2, 0, 3, 1, 4, 1, 5, 2, 6)
        );

        char('}',
            new cnc.Stroke(0, 0, 1, 1, 1, 2, 2, 3, 1, 4, 1, 5, 0, 6)
        );

        char('@',
            new cnc.Stroke(4, 2, 2, 2, 2, 4, 4, 4, 4, 1, 3, 0, 1, 0, 0, 1, 0, 5, 1, 6, 4, 6)
        );
        
        char('#',
            new cnc.Stroke(1, 0, 1, 6),
            new cnc.Stroke(3, 6, 3, 0),
            new cnc.Stroke(4, 2, 0, 2),
            new cnc.Stroke(0, 4, 4, 4)
        );

        char('$',
            new cnc.Stroke(3, 1, 1, 1, 0, 2, 1, 3, 3, 3, 4, 4, 3, 5, 1, 5),
            new cnc.Stroke(2, 6, 2, 0)
        );

        char('%',
            new cnc.Stroke(),
            new cnc.Stroke(),
            new cnc.Stroke()
        );

        char('^',
            new cnc.Stroke(0, 2, 2, 0, 4, 2)
        );

        char('&',
            new cnc.Stroke(4, 4, 2, 6, 1, 6, 0, 5, 3, 2, 3, 1, 2, 0, 1, 0, 0, 1, 0, 2, 4, 6)
        );

        char('*',
            new cnc.Stroke(0, 1, 1, 2, 3, 2, 4, 1),
            new cnc.Stroke(4, 5, 3, 4, 1, 4, 0, 5),
            new cnc.Stroke(2, 6, 2, 0)
        );

        char('(',
            new cnc.Stroke(1, 0, 0, 1, 0, 5, 1, 6)
        );

        char(')',
            new cnc.Stroke(1, 0, 0, 1, 0, 5, 1, 6)
        );

        char('_',
            new cnc.Stroke(0, 6, 4, 6)
        );

        char('-',
            new cnc.Stroke(0, 3, 4, 3)
        );

        char('+',
            new cnc.Stroke(0, 3, 4, 3),
            new cnc.Stroke(2, 1, 2, 5)
        );

        char('=',
            new cnc.Stroke(0, 2, 4, 2),
            new cnc.Stroke(0, 4, 4, 4),
        );



        _this.getglyph = (c) => {
            
            if (c === ' ') {
                var g = new cnc.Glyph(' ', []);
                g.customwidthinpoints = 5;
                return g;
            }
            if (c === '\t') {
                var g = new cnc.Glyph('\t', []);
                g.customwidthinpoints = 5 * 4;
                return g;
            }

            for (var i = 0; i < _this.glyphs.length; i++) {
                if (_this.glyphs[i].char === c) {
                    return _this.glyphs[i];
                }
            }
            
            throw 'Glyph not found for character \''+c+'\'';
            
        };

        return _this;

    };
};
