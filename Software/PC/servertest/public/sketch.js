
var socket;
var magnet=false;
var str=undefined;
var w=55;
var board=new Board(w)
function setup() {
	
	socket = io.connect('http://localhost:3000');
	socket.on('data', function(data) {
		str=data
			console.log('Received: '+data);
		});
	socket.on('status', function(data) {
		str=data
			console.log('STATUS '+str[0]);
			board.mover.headLoc[0]=str[1][0];
			board.mover.headLoc[1]=str[1][1];
			board.receivedPos=str[2];
		});
	m=createButton("turn magnet ON");
	m.mousePressed(magnetToggled);
    inp_grbl = createInput('?');
	inpu_grbl_send=createButton("Send immediate");
	inpu_grbl_send.mousePressed(inpu_grbl_sender);
	
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
	pc = createCheckbox('Show Real pieces', true);
	pc.changed(PieceShowChanged);
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
function PieceShowChanged() {board.showReceivedPos=this.checked();
}

function myInputEvent() {
}
function SendPressed() {
	setFEN(inp.value(),board);
}

function inpu_grbl_sender() {
        socket.emit('path', { "immediate":inp_grbl.value()+'\n'});
}

function magnetToggled() {
    if(magnet){
        socket.emit('path', { "immediate":"M3\n" });
		m.html("turn magnet OFF");
    }else{
        socket.emit('path', { "immediate":"M5\n" });
		m.html("turn magnet ON");
    }
    magnet=!magnet;
}

