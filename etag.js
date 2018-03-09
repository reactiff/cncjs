//////////////////////////////////////////////////////////////////////// STRING
String.prototype.repeat = function (n) { return Array(n).join(this); };
String.prototype.contains = function (text) { return this.indexOf(text) >= 0; }
String.prototype.any = function (/*args or array*/) {
    var ismatch = false;
    arguments.forEach(function (arg) {
        if (Array.isArray(arg)) {
            arg.forEach(function (argtoken) {
                if (this === argtoken) {
                    ismatch = true;
                    return false;
                }
            });
            if (ismatch) {
                return false;
            }
        } else { if (this === arg) { ismatch = true; return false; } }
    });
    return ismatch;
}
String.prototype.removeDoubleSpace = function () {
    var result = this;
    while (result.contains('  ')) {
        result = result.replace(/\s\s/g, ' ');
    }
    return result;
};

/*
    Enumerates over all matches for the given regular expression, calling the specified callback and passing it the match object, while removing each matched string from a copy of the source string, and returning the stripped down version.
*/
String.prototype.forEach = String.prototype.forEach || function (regex, callback) {
    var stripped = this;
    var m = regex.exec(stripped);
    var matchedStrings = [];
    while (m != null) {
        callback(m);
        matchedStrings.push(m[0]);
        //stripped = stripped.replace(m[0], '');
        m = regex.exec(stripped);
        if (regex.lastIndex < 0 || m == null || m.index == regex.lastIndex) {
            break;
        }

    }

    matchedStrings.forEach(function (s) {
        stripped = stripped.replace(s, '');
    });
    

    return stripped.trim();
};

/*In contrast to forEach, next() method will only process one regex match and exit, returning the string stripped of the first match*/
String.prototype.next = String.prototype.next || function (regex, callback) {
    var stripped = this;
    var m = regex.exec(stripped);
    if(m != null) {
        var replacewhat = callback(m);
        if (replacewhat) {
            stripped = stripped.replace(replacewhat, '');
        }
        else {
            stripped = stripped.replace(m[0], '');
        }
    }
    return stripped.trim();
};

String.prototype.count = function (substr) {
    var string = this;
    if (!substr) return 0;
    var n = 0, pos = 0, step = substr.length;
    while (true) {
        pos = string.indexOf(substr, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
};



//////////////////////////////////////////////////////////////////////// NUMBER
Number.prototype.floor = Number.prototype.floor || function () { return parseInt(this); };
Number.prototype.ceiling = Number.prototype.ceiling || function () { var floor = parseInt(this); return floor==this ? floor : floor+1; };
Number.prototype.remap = function () {
    if (arguments.length == 0) return this;
    if (arguments.length % 2 != 0) throw 'Parity error';
    for (var i = 0; i < arguments.length; i += 2) {
        var val = parseInt(this);
        if (val == arguments[i]) { return arguments[i + 1]; }
    }
    return this;
};


//////////////////////////////////////////////////////////////////////// MATH
Math.randomInt = function (from, to) {
    if (from == to) return from;
    var min = Math.min(from, to);
    var max = Math.max(from, to);
    var rnd = Math.random() * (max - min);
    var f = rnd.floor();
    var c = rnd.ceiling();
    if (f == c) return rnd + min;
    var mid = parseFloat(c - f) / 2;
    return ((rnd-f) > mid ? c : f) + min;
}

//////////////////////////////////////////////////////////////////////// ARRAY
/*
callback: function (item, index, array) {}
*/
Array.prototype.forEach = function (callback) {
    for (var i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            break;
        }
    }
};

Array.prototype.first = Array.prototype.first|| function () {
    return this[0];
};

Array.prototype.last = Array.prototype.last || function () {
    return this[this.length - 1];
};

Array.prototype.range = Array.prototype.range || function () {
    switch (arguments.length) {
        case 0:
            return [];
        case 1:
            // an array n elements
            var arr = new Array(arguments[0]);
            for(var i=0; i<arguments[0]; i++){
                arr[i] = i;
            }
            return arr;
        case 2:
            // from (inclusive) to (exclusive) range
            var _from = arguments[0];
            var _to = arguments[1];
            var _dir = _from < _to ? 1 : -1;
            var _len = Math.max(_from, _to) - Math.min(_from, _to) + 1;

            var arr = new Array(_len);

            for (var i = 0; i<_len; i++) {
                arr[i] = _from + i * _dir;
            }
            return arr;
        case 3:
            //TO DO:
            //implement range with a step
            throw 'Range with step is not implemented';
    }
};

Array.prototype.addRange = Array.prototype.addRange || function (range) {
    range.forEach(function (x) { this.push(x); });
};

Array.prototype.first = Array.prototype.first || function (qualifier) {
    var retval;
    this.forEach(function (item) {
        if (typeof qualifier === 'undefined' ? true : qualifier) {
            retval = item;
            return true;
        }
    });
    return retval;
}

Array.prototype.last = Array.prototype.last || function (qualifier) {
    return this.reverse().first(qualifier);
}

//extend Array.protoype if needed
Array.prototype.all = Array.prototype.all || function (qualifier) {
    var someAreFalse = this.some(function (x) {
        var result = qualifier(x);
        return !result;
    });
    return !someAreFalse;
}


//////////////////////////////////////////////////////////////////////// NODE
if (typeof NodeList !== 'undefined') {
    NodeList.prototype.forEach = NamedNodeMap.prototype.forEach = function (fn, thisarg) {
        Array.prototype.slice.call(this).forEach(fn, thisarg);
    };
    Node.prototype.hasClass = Node.prototype.hasClass || function (cls) {
        if (!this.className || this.className.indexOf(cls) < 0) {
            return false;
        }
        return true;
    };
    Node.prototype.addClass = function (cls) {
        if (!this.className || this.className.indexOf(cls) < 0) {
            var curcls = this.className;
            if (!curcls) {
                curcls = '';
            }
            this.className = curcls.trim() + ' ' + cls;
        }
        return this;
    };
    Node.prototype.removeClass = function (cls) {
        this.className = this.className.replace(cls, '');
        return this;
    };
    Node.prototype.toHtml = function () {
        return $e('div', this).innerHTML;
    };
}


var $e = function (tag, content) {
    var parseName = function (input) {
        var m = /^([a-zA-Z0-9]+?)($|\#|\s|\n|\.)/.exec(input);
        var result;
        if (m && m.length > 0) {
            result = m[1];
        }
        else {
            result = undefined;
        }
        return result;
    };
    var parseId = function (input) {
        var m = /^\S+?\#(\S+?)[\.\s$]/.exec(input);
        var result;
        if (m && m.length > 0) {
            result = m[1];
        }
        else {
            result = undefined;
        }
        return result;
    };
    var parseClass = function (input) {
        var m = /[\S\s\-]+?\.([\S\-]+?)(\s|\#|$)/.exec(input);
        var result;
        if (m && m.length > 0) {
            result = m[1];
        }
        else {
            result = undefined;
        }
        return result;
    };
    var parseAttributes = function (input) {
        var attrre = /\s(\S+=".*?")/g;
        var attrm = attrre.exec(input);
        var keyValuePairs = [];
        while (attrm != null) {
            var tokens = attrm[1].split('=');
            if ((tokens[1][0] == '\'' && tokens[1][tokens[1].length - 1] == '\'') ||
                (tokens[1][0] == '"' && tokens[1][tokens[1].length - 1] == '"')) {
                tokens[1] = tokens[1].substring(1, tokens[1].length - 1);
            }
            keyValuePairs.push({ key: tokens[0], value: tokens[1] });
            attrm = attrre.exec(input);
            if (attrre.lastIndex < 0) {
                break;
            }
        }
        return keyValuePairs;
    }
    var parseTag = function (input) {
        return {
            name: parseName(input),
            id: parseId(input),
            className: parseClass(input),
            attributes: parseAttributes(input)
        };
    }
    var parseStack = function (input) {
        var stackedre = /^(\S+(\s*\>\s*\S+)+)/;
        var stackedm = stackedre.exec(input);
        var stack = [];
        if (stackedm != null) {
            var tokens = stackedm[1].split('>');
            tokens.forEach(function (x) {
                stack.push(parseTag(x.trim()));
            });
        }
        else {
            //its a single tag name
            stack.push(parseTag(input));
        }
        return stack;
    };
    var addContentItem = function (targetNode, contentItem) {
        var _asNode = function (targetParentNode, nodeContent) {
            var contentType = typeof nodeContent;
            var hasNodeName = nodeContent.nodeName ? true : false;
            if (contentType === 'object' && hasNodeName) {
                return nodeContent;
            }
            else{
                if (targetParentNode.tagName === 'UL' || targetParentNode.tagName === 'OL') {
                    return $e('li', nodeContent);
                }
                else if (targetParentNode.tagName === 'select') {
                    return $e('option', nodeContent);
                }
                return document.createTextNode(nodeContent);
            }
        }

        if (contentItem !== undefined) {
            if (Array.isArray(contentItem)) {
                contentItem.forEach(function (item) {
                    addContentItem(targetNode, item);
                });
            }
            else {
                targetNode.appendChild(_asNode(targetNode, contentItem));
            }
        }
        
        return targetNode;
    };
    
    var stack = parseStack(tag);    
    
    if (arguments.length > 2) {
        content = [].slice.apply(arguments).slice(1);
    }

    while (stack.length) {

        var tag = stack.pop();
        var eNode = document.createElement(tag.name);

        if (tag.id) { eNode.setAttribute('id', tag.id); }
        if (tag.className) { eNode.setAttribute('class', tag.className.split('.').join(' ')); }

        tag.attributes.forEach(function (attr) { eNode.setAttribute(attr.key, attr.value); });

        content = addContentItem(eNode, content);
        
        
    }
    
    return eNode;
};
