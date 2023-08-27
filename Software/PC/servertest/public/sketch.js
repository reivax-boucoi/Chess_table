/*document.getElementById('magnetON').onclick = function() {
socket.emit('path', { "status":"M3\n" });
};

document.getElementById('magnetOFF').onclick = function(){               
socket.emit('path', { "status":"M5\n" });
};
*/

var socket;
var magnet=false;

function setup() {
  createCanvas(400, 400);
  background(0);
  socket = io.connect('http://localhost:3000');
  socket.on('data', function(data) {
        console.log('Received: '+data);
    });
  b=createButton("MagnetToggle");
  b.mousePressed(magnetToggled);
}

function draw() {
}

function mousePressed() {
}
function magnetToggled() {
    if(magnet){
        socket.emit('path', { "status":"M3\n" });
    }else{
        socket.emit('path', { "status":"M5\n" });
    }
    magnet=!magnet;
    console.log(magnet);
}
