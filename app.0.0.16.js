var _requiredScripts = [];
var _mainScript = '';

var _cncsocket = null;
var _createWebSocket = function(){
    _cncsocket = new WebSocket('ws://' + window.location.hostname + ':81/');
};

var _codeversionmessageparser = function(evt){
  if(evt.data.indexOf('memdata:')>=0){
    var kv = evt.data.split(':')[1];
    var t = kv.split('=');
    var addr = t[0];
    if(addr=='0'){
      var gittag = t[1];
      $('#gittaginput').val(gittag);
      //git version
      var files = ['etag.js', 'vector.js', 'linearstage.js', 'rotarystage.js',
                   'shapes.js',
                   'cnctext.js',
                   'cncfontsimple.js',
                   'cncglyph.js',
                   'cncpoint.js',
                   'cncstroke.js'
                  ]; //main file last
      files.forEach(function(filename){
        _loadScript('https://cdn.rawgit.com/nycdude777/cncjs/' + gittag + '/' + filename, true);
      });
      _mainScript = 'https://cdn.rawgit.com/nycdude777/cncjs/' + gittag + '/cnc.js'
      _cncsocket.removeEventListener('message', _codeversionmessageparser);
    }
  }
};

var _codeversionconnectionhandler = function(){
    _cncsocket.removeEventListener('open', _codeversionconnectionhandler);
    _cncsocket.addEventListener('message', _codeversionmessageparser);
    _cncsocket.send('mem.get.000.007');
};

function getversion(){
    _createWebSocket();
    _cncsocket.addEventListener('open', _codeversionconnectionhandler);
}

var _codeversionsettinghandler = function() {
    var value = $('#gittaginput').val(); 
    _cncsocket.send('mem.set.000.007.'+value); 
    _cncsocket.removeEventListener('open', _codeversionsettinghandler);
};

function setversion() { 
  _createWebSocket();
  _cncsocket.addEventListener('open', _codeversionsettinghandler);
}

var _loadScript = function(url, require)  { 
  var script = document.createElement('script');
  script.src = url;
  if(require){
    script.setAttribute('onload', '_scriptLoaded(this)');
    _requiredScripts.push(script);  
  }
  document.head.appendChild(script); 
};

var _scriptLoaded = function (tag) {
    var numloaded = 0;
    var src = tag.getAttribute('src');
    _requiredScripts.forEach(function(scr) {
      if(scr.src === src){
        scr.loaded = 1;
      }
      if(scr.loaded){
        numloaded++;
      }
    });
    if(numloaded===_requiredScripts.length){
      _loadScript(_mainScript, false);
    }
};

