let machine_coords={x0:-2.5+35/2,y0:-17-35/2,w:-35}//offset y by 35 to account

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
    
    socket.on('path',function(data){
        
        
        if(data.immediate!=undefined){
          if(data.immediate=="?\n"){
            port.write('?');            
          }else{
            console.log("[Client] " +data.immediate);
            port.write( data.immediate );
          }
        }else if(data.move!=undefined){
          let x= (data.move[0]*machine_coords.w + machine_coords.x0).toFixed(2);
          let y= (data.move[1]*machine_coords.w + machine_coords.y0).toFixed(2);
        console.log("[Client] " +"Path "+x+"\t"+y);
            port.write( "X"+ x +" Y"+ y +"\n");
          
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
