var CncWSCommMessageHandler = function(evt, flags, number) {
  console.log('(machine)--->[MSG]: ' + evt.data);
  
  if (evt.data.substring(0,4) === 'int.') {
      console.log('queue size: ' + cnc.getcommandqueuelength());
      cnc.interruptOccured();
  }
  
  cnc.notify(evt.data);
  
  if (evt.data === 'm3d.ok') {
      cnc.executeNextCommand();
  }
  
};
    
var CncAwaitWSConnection = function(resolve){
    if(_cncsocket.readyState===1){
        resolve(_cncsocket);
        return;
    }

    if(_cncsocket.readyState===2) { //closing
        _cncsocket.close();
    }

    if(_cncsocket.readyState===3) { //closed
        //create a new socket
        _cncsocket = _createWebSocket();
        _cncsocket.addEventListener("message", CncWSCommMessageHandler);
    }

    //if we got here, the socket is opening
    setTimeout(CncAwaitWSConnection, 50, resolve);
};
    
var CncWSConnect = function () {
    return new Promise((resolve, reject) => {
        CncAwaitWSConnection(resolve);
    });
};
