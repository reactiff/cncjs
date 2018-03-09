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
          var files = ['linearstage.js', 'rotarystage.js', 'cnc.js']; //main file last
          files.forEach(function(filename){
            var script = document.createElement('script');
            script.src = 'https://cdn.rawgit.com/nycdude777/cncjs/blob/' + gittag + '/' + filename;
            document.head.appendChild(script); 
          });
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
