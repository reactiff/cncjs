const _cnc_kb_keymap = {};
var CncInitUI = function () {

    //bind keyboard shortcuts
    $(document).keydown(function (e) {

        if (!e.ctrlKey) { //only respond to keyboard CNC control shortcuts when CTRL key is held down
            return;
        }

        if (_cnc_kb_keymap[e.keyCode]) { return; }
        _cnc_kb_keymap[e.keyCode] = 1;

        var stepsize = e.altKey ? cnc.STEPSIZE.SIXTEENTH : cnc.STEPSIZE.WHOLE;

        if (e.keyCode == 37) { // left
            cnc.axis.X.engage(cnc.DIRECTION.FORWARD, stepsize);
        }
        else if (e.keyCode == 38) { // up/away
            if (e.shiftKey) {
                cnc.axis.Z.engage(cnc.DIRECTION.REVERSE, stepsize);
            }
            else {
                cnc.axis.Y.engage(cnc.DIRECTION.REVERSE, stepsize);
            }
        }
        else if (e.keyCode == 39) { // right
            cnc.axis.X.engage(cnc.DIRECTION.REVERSE, stepsize);
        }
        else if (e.keyCode == 40) { // down/towards
            if (e.shiftKey) {
                cnc.axis.Z.engage(cnc.DIRECTION.FORWARD, stepsize);
            }
            else {
                cnc.axis.Y.engage(cnc.DIRECTION.FORWARD, stepsize);
            }
        }
    });

    $(document).keyup(function (e) {

        if (e.keyCode == 37) { // left
            cnc.axis.X.disengage();
        }
        else if (e.keyCode == 38) { // up/away
            cnc.axis.Y.disengage();
            cnc.axis.Z.disengage();
        }
        else if (e.keyCode == 39) { // right
            cnc.axis.X.disengage();
        }
        else if (e.keyCode == 40) { // down/towards
            cnc.axis.Y.disengage();
            cnc.axis.Z.disengage();
        }

        _cnc_kb_keymap[e.keyCode] = 0;

    });

    $($e('textarea#userscript.code')).appendTo('body');

    var btn = $e('button type="button"', 'Execute');
    $(btn).click(function (e) {
        var script = $('#userscript').value || $('#userscript').val();
        eval(script);
    });
    $('body').append(btn);

    var btn2 = $e('button type="button"', 'Commands');
    $(btn2).click(function (e) {
        var script = $('#userscript').value || $('#userscript').val();
        cnc.setoffline(true);
        eval(script);
    });
    $('body').append(btn2);


};
