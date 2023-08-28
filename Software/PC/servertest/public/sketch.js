
var socket;
var magnet=false;

var w=55;
var board=new Board(w)
function setup() {
	
	socket = io.connect('http://localhost:3000');
	socket.on('data', function(data) {
			console.log('Received: '+data);
		});
	m=createButton("MagnetToggle");
	m.mousePressed(magnetToggled);
	
	board.initializePieces();
	c=createCanvas(16*w+5, 8*w+5+board.toff*2);
	c.mousePressed(CanvasPressed);
	b = createButton("Reset brd");
	b.mousePressed(ButtonPress);
	i = createCheckbox('Show indices', false);
	i.changed(IndicesChanged);
	n = createCheckbox('Show Head', true);
	n.changed(HeadChanged);
	p = createCheckbox('Show Path', true);
	p.changed(PathChanged);
    inp = createInput('');
	inp.input(myInputEvent);
	s=createButton("Send FEN");
	s.mousePressed(SendPressed);
	f=createDiv("FEN");
}

function draw() {
	background(255);
	board.show();
}

function CanvasPressed() {
	let fen=board.clicked(mouseX,mouseY);
	//	console.log(mouseX,mouseY);
	if(fen)	f.html(fen);
}

function keyPressed(){
}

function ButtonPress() {
	console.log("ResetButtonPressed");
	board.initializePieces();
}
function IndicesChanged() {
	board.showCellNum=this.checked()
}
function HeadChanged() {board.mover.showHead=this.checked();
}
function PathChanged() {board.mover.showPath=this.checked();
}

function myInputEvent() {
}
function SendPressed() {
	setFEN(inp.value(),board);
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

