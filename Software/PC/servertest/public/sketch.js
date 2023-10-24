
var socket;
var str=undefined;
var w=55;
var board=new Board(w)
var clicked=false, clickTimeout=300; 
var poll_it;

function setup() {

	m=createButton("Initialize bot");
	m.mousePressed(bot_init);
    inp_grbl = createInput('?');
	inpu_grbl_send=createButton("Send immediate");
	inpu_grbl_send.mousePressed(inpu_grbl_sender);
	toggleMagnet=createButton("Toggle magnet");
	toggleMagnet.mousePressed(toggleMagnetPressed);
	st=createDiv("GRBL status:");
	
	socket = io.connect('http://localhost:3000');
	socket.on('data', function(data) {
		str=data
			console.log('Received: '+data);
		});
	socket.on('status', function(data) {
		str=data;
		st.html("GRBL status:"+str[0]);
			if(str[0]!="Idle" && str[0]!="Run"){
				clearInterval(poll_it);
				console.log("Stopped poll");
			}
			//console.log('STATUS '+str[0]);
			board.mover.headLoc[0]=str[1][0]*w+board.loff;
			board.mover.headLoc[1]=str[1][1]*w+board.toff;
			board.receivedPos=str[2];
		});
		
	board.initializePieces();
	board.mover.socket=socket;
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
function CanvasPressed(){
  if(!clicked){
    clicked=true;
    setTimeout(function(){
      if(clicked){
        clicked=false;
        //single ClickStuff
		let fen=board.clicked(mouseX,mouseY);
		//	console.log(mouseX,mouseY);
		if(fen)	f.html(fen);

      }
    },clickTimeout);
  }else{
    clicked=false;
	board.doubleClicked(mouseX, mouseY);
  }
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

function toggleMagnetPressed() {
	board.mover.headActive=!board.mover.headActive;
	socket.emit('path', { "immediate":(board.mover.headActive?"M3":"M5")+'\n'});
	
}

function inpu_grbl_sender() {
        socket.emit('path', { "immediate":inp_grbl.value()+'\n'});
		poll_it=setInterval(poll,250);
}

function bot_init() {
	socket.emit('path', { "immediate":"$H\r\nS1000\r\nG1 F1000\r\n" });
	st.html("GRBL status: Homing");
	poll_it=setInterval(poll,250);
}

function poll(){
        socket.emit('path', { "immediate":"?\n"});	
}
