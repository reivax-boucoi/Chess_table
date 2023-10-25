let machine_coords={x0:-2.5+35/2,y0:-17-35/2,w:-35}//offset y by 35 to account
let RX_BUFFER_SIZE = 100;
let transmitter={data:[], isActive:0}//sentSize:[], availableSize:RX_BUFFER_SIZE}

var SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
    delimiter: '\r\n'
});

var port = new SerialPort('/dev/rfcomm0',{ 
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, "localhost",listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server started at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
    //transmitter.availableSize=RX_BUFFER_SIZE;
    //transmitter.sentSize=[];
    transmitter.isActive=0;
    transmitter.data=[];
    socket.on('path',function(data){
        
        
        if(data.immediate!=undefined){
          if(data.immediate=="?\n"){
            port.write('?');            
          }else{
            console.log("[Client] " +data.immediate);
            pushCommand( data.immediate );
          }
        }else if(data.move!=undefined){
          let x= (data.move[0]*machine_coords.w + machine_coords.x0).toFixed(2);
          let y= (data.move[1]*machine_coords.w + machine_coords.y0).toFixed(2);
          let cmd="X"+ x +" Y"+ y +"\n"
          pushCommand(cmd);

          
        }else if(data.magnet!=undefined){
          pushCommand(data.magnet=="ON"? "M3\n" : "M5\n");
        }
    
    });
      
    parser.on("data", function (data) {
        if(data!="ok"){
          if(data[0]=='<'){
              io.emit("status",parseStatus(data));
          }else{
            console.log("[GRBL] " + data);
            io.emit("data", data);
          } 
        }else{
          if(transmitter.data.length>0){
            let cmd=transmitter.data.splice(0,1)[0];
            console.log("[Buffer send] " + cmd);
            port.write(cmd);
          }else{
            transmitter.isActive=0;
          }
          /*
          let s=transmitter.sentSize.splice(0,1);
          if(s!=[] && s[0]!=undefined ){
            transmitter.availableSize+=s[0];
            console.log("[Buffer] Redeemed "+s[0]+" chars, current available is "+transmitter.availableSize);
            
          }else{
           console.log("[Buffer] received OK but nothing was in sent Size !");
          }
          if(transmitter.data.length>0){
            if(transmitter.data[0].length<transmitter.availableSize){//we can send further data
              let cmd=transmitter.data.splice(0,1)[0];
              port.write(cmd);
              transmitter.availableSize-=cmd.length;
              transmitter.sentSize.push(cmd.length);   
              console.log("[Buffer] Allowed to send new data \"" + cmd.replace('\n','') + "\", new size left "+transmitter.availableSize+", "+ transmitter.data.length +" items left to send");   
            }else{
              console.log("[Buffer] We have "+transmitter.availableSize+" data to send, but not enough room yet: " +transmitter.data[0].length +" needed, actual:" + transmitter.availableSize);
            }
          }else{
            console.log("[Buffer] No more data to send");
          }*/
        }
    });
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);

function parseStatus(str){
  
  let status=str.substring(1,str.indexOf('|'));//`Idle, Run, Hold, Jog, Alarm, Door, Check, Home, Sleep`
  
  let coords=str.match(/Pos:([-\d.]+),([-\d.]+),[-\d.]+\|/);
  coords=[(coords[1]-machine_coords.x0)/machine_coords.w,
          (coords[2]-machine_coords.y0)/machine_coords.w ];
  
  let i=str.indexOf("|He:");
  let piecemap="";
  if(i!=-1){
    for(let j=i+4;j<i+4+16;j++)piecemap+=(str[j].charCodeAt()-97).toString(2).padStart(4,'0')
  }
  return [status,coords,piecemap];
}

function pushCommand(cmd){
  if(transmitter.isActive>1){
   transmitter.data.push(cmd); 
    console.log("[Buffer store] " + cmd);
  }else{
    transmitter.isActive+=1;
    console.log("[Buffer send direct] " + cmd);
    port.write(cmd);
  }
  /*
  if(transmitter.availableSize>cmd.length){
    port.write(cmd);
    transmitter.availableSize-=cmd.length;
    transmitter.sentSize.push(cmd.length);
    console.log("[Client] Path: \""+cmd.replace('\n','') + "\", Buffer space available for immediate send ("+transmitter.availableSize+" left)");      

  }else{
    console.log("[Client] Path: \""+cmd.replace('\n','') + "\", Buffer space too small "+transmitter.availableSize+" left, pushing to queue, ("+(transmitter.data.length+1) + "items)");
    transmitter.data.push(cmd);
  }*/
}
