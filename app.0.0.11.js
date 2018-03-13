var _requiredScripts = [];
var _mainScript = '';

function _wsconnect() {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://' + window.location.hostname + ':81/');
    ws.onopen = () => resolve(ws);
  });
}
  
function getversion(){
  
  _wsconnect().then(function(ws){
    
    ws.onmessage = function (evt) {
      console.log(evt.data);
      if(evt.data.indexOf('memdata:')>=0){
        var kv = evt.data.split(':')[1];
        var t = kv.split('=');
        var addr = t[0];
        if(addr=='0'){
          var gittag = t[1];
          $('#gittaginput').val(gittag);
          //git version
          var files = ['etag.js', 'linearstage.js', 'rotarystage.js']; //main file last
          files.forEach(function(filename){
            _loadScript('https://cdn.rawgit.com/nycdude777/cncjs/' + gittag + '/' + filename, true);
          });
          _mainScript = 'https://cdn.rawgit.com/nycdude777/cncjs/' + gittag + '/cnc.js'
        }
      }
    };
    
    ws.send('mem.get.000.007');
      
  });
}

function setversion() { 
  var value = $('#gittaginput').val(); 
  _wsconnect().then(function(ws){
    ws.send('mem.set.000.007.'+value); 
  });
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

