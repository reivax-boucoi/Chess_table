class Board{
    constructor(w){
        this.w=w;
        this.cells=new Array(64);
        this.loff=15;
        this.toff=20+this.w;
        
        this.stLoffW=this.w*8+this.loff;
        this.stToffW=this.toff;
        this.stFillIndexW=[];
        this.stLoffB=this.stLoffW+this.w;
        this.stToffB=this.toff;
        this.stFillIndexB=[];
        
        this.showCellNum=false;
        
        this.selectIndex=-1;
        this.legal=new Legal(this.cells);
        this.nbFullMoves=1;
        this.WhiteTurn=true;
        
        this.mover=new Mover(this);
        
        this.receivedPos=[];
        this.receivedCapt=undefined;
        this.showReceivedPos=true;
    }
    show(){
        noStroke();
        rectMode(CORNERS);
        fill(100);
        rect(this.loff-1,this.toff-1,this.loff+8*this.w+1,this.toff+8*this.w+1); //game square
        for (var j = 0; j < 8; j++) {
            for (var i = 0; i < 8; i+=2) {
                fill(200);
                let k=i+(j%2)
                rect(k*this.w+this.loff,this.toff+this.w*j,this.loff+(k+1)*this.w,this.toff+(j+1)*this.w);
                
            }
        }
        if(this.showCellNum){//cell index numbering
            textSize(this.w/4)
            fill(0)
            let offset=0.15
            for (var i = 0; i < 64; i++){
                text(i,((i%8)+offset)*this.w+this.loff,this.toff+(floor(i/8)+offset)*this.w)
            }
        }
        
        textSize(this.w/4)//row/column label
        fill(0)
        let offset=10;
        for (var i = 0; i < 8; i++){
            let letter='abcdefgh'.charAt(i)
            text(letter,(i+0.5)*this.w+this.loff,this.toff-offset)
            text(letter,(i+0.5)*this.w+this.loff,this.toff+this.w*8+offset)
            text(8-i,this.loff-offset,(i+0.5)*this.w+this.toff)
            text(8-i,this.loff+this.w*8+offset,(i+0.5)*this.w+this.toff)
        }
        
        
        stroke(100);
        fill(220);
        for (var i = 0; i < 8; i++) {//lines
            stroke(100);
            //left storage
            rect(this.stLoffW,this.stToffW+i*this.w,this.w+this.stLoffW,this.stToffW+(1+i)*this.w);
            rect(this.stLoffW+this.w,this.stToffW+i*this.w,this.stLoffW+this.w*2,this.stToffW+(i+1)*this.w);
            
            //right storage
            rect(this.stLoffB,this.stToffB+i*this.w,this.w+this.stLoffB,this.stToffB+(1+i)*this.w);
            rect(this.stLoffB+this.w,this.stToffB+i*this.w,this.stLoffB+this.w*2,this.stToffB+(i+1)*this.w);
        }
        
        
        this.mover.update();
        this.mover.show();
        
        rectMode(CENTER);
        fill(0,0,255,50);
        noStroke();
        for (var i = 0; i < this.receivedPos.length; i++) {
            if(this.receivedPos[i]=="1"){
                let p=this.mover.getXYfromIndex(i);
                rect(p[0]+1,p[1]+1, this.w-2, this.w-2);
            }
        }
        
        for (var i = 0; i < this.cells.length; i++) {//pieces
            if(this.cells[i]!=undefined){
                this.cells[i].show();
                if(this.selectIndex==i){
                    rectMode(CENTER);
                    fill(255,0,0,50);
                    rect(this.cells[i].x,this.cells[i].y, this.w, this.w);
                }
            }
        }
        if(this.selectIndex!=-1){//show legal moves
            fill(255,255,0,50);
            rectMode(CENTER);
            
            for (let i = 0; i < this.legal.legalMoves.length; i++) {
                let [x,y]=this.mover.getXYfromIndex(this.legal.legalMoves[i]);
                rect(x,y, this.w,this.w);
            }
        }
        
        for (var i = 0; i < this.stFillIndexW.length; i++) {//W captured pieces
            this.stFillIndexW[i].show();
        }
        for (var i = 0; i < this.stFillIndexB.length; i++) {//B captured pieces
            this.stFillIndexB[i].show();
        }
        
        
        
    }
    
    initializePieces(){
        let type=[TOUR, CAV, FOU, DAME, ROI, FOU, CAV, TOUR, PION, PION, PION, PION, PION, PION, PION, PION];
        
        this.stFillIndexW=[];
        this.stFillIndexB=[];
        this.cells.length=0;
        this.nbFullMoves=1;
        this.WhiteTurn=true;
        this.legal.roqueStatus='KQkq';
        for (var i = 0; i < 16; i++) {//pieces
                this.cells[i]=new Cell(this.loff+this.w*((i%8)+0.5),this.toff+this.w*(floor(i/8)+0.5), type[i],this.w);
                
                let tWhite=i;
                if(i==3){//swap roi/dame for white
                    tWhite=4;
                }else if(i==4){
                    tWhite=3;
                }
                    
                this.cells[63-i]=new Cell(this.loff+this.w*(7.5-(i%8)) , this.toff+this.w*(7.5-floor(i/8)), type[tWhite]+16,this.w);
        }    
    }
    
    clicked(x,y){
        let i=floor((x-this.loff)/this.w);
        let j=floor((y-this.toff)/this.w);
        
        if(i<0 || j<0 || i>7 || j>7){
            console.log("press outside");
            return;
        }
       let index=j*8+i;
       if(this.cells[index]!=undefined && this.selectIndex==-1){//force alternate b/w moves
           if((this.cells[index].type>15)!=this.WhiteTurn){
                console.log("It's not your turn !");
                return;
           }
        }
        if(this.selectIndex==-1){ //if cell was not previously selected
            if(this.cells[index]==undefined){
                console.log("please select a piece to move first");
                return;
            }
            this.selectIndex=index;
            this.legal.calculate(index);
            //console.log("Selected "+this.selectIndex);
        }else{
            if(index==this.selectIndex){//unselect if selecting same
                this.selectIndex=-1;
            }else{
                //try to move from selectIndex to index. check valid & capture
                //console.log("attempt move: from "+this.selectIndex+" to "+index);
                if(this.legal.legalMoves.indexOf(index)==-1){
                    console.log("Illegal move: from "+this.selectIndex+" to "+index);
                    this.selectIndex=-1;
                    return;
                }
                if(this.cells[index]!=undefined){//destination not empty -> capture
                    this.capture(index);
                }    
                
                if((this.cells[this.selectIndex].type%16)==PION && index==this.legal.enPassant){//en passant capture
                    if(this.cells[this.selectIndex].type<16){//black
                        this.capture(this.legal.enPassant-8);
                    }else{
                        this.capture(this.legal.enPassant+8);
                        
                    }
            }
                    
                this.premove(this.selectIndex,index);
                this.selectIndex=-1;
                this.WhiteTurn=!this.WhiteTurn;
                if( this.WhiteTurn)this.nbFullMoves+=1;
                return getFEN(this);
            
            }
        }
    }
    
    doubleClicked(x,y){
        let i=floor((x-this.loff)/this.w);
        let j=floor((y-this.toff)/this.w);        
        
        if(i<0 || j<0 || i>7 || j>7){
            console.log("double press outside");
            return;
        }
        let index=j*8+i;
        this.mover.headpos=this.mover.getXYfromIndex(index);
        this.mover.sendMove(this.mover.headpos);
        console.log("Manual GOTO "+getNameFromIndex(index));   
        
    }
    
    premove(source, dest){
        this.legal.enPassant=-1;
        //roque
        if(source== 0 || source == 4 )this.legal.roqueStatus=this.legal.roqueStatus.replace('q','')
        if(source == 4 || source == 7)this.legal.roqueStatus=this.legal.roqueStatus.replace('k','')
        if(source== 56 || source == 60)this.legal.roqueStatus=this.legal.roqueStatus.replace('Q','')
        if(source == 60 || source == 63)this.legal.roqueStatus=this.legal.roqueStatus.replace('K','')
        if((this.cells[source].type%16)==ROI && abs(dest-source)==2){//if king is moving more the 1 space -> roque
            this.cells[dest]=this.cells[source];//move king
            
            if(this.cells[source].type>15){//roque white
            this.cells[source]=undefined;
                if(dest==58){
                    this.cells[59]=this.cells[56];
                    this.cells[56]=undefined;
                    this.mover.roque(56, 59, source, dest);
                }else{
                    this.cells[61]=this.cells[63];
                    this.cells[63]=undefined;
                    this.mover.roque(63, 61, source, dest);
                }
            }else{//roque black
            this.cells[source]=undefined;
                if(dest==2){
                    this.cells[3]=this.cells[0];
                    this.cells[0]=undefined;
                    this.mover.roque(0, 3, source, dest);
                }else{
                    this.cells[5]=this.cells[7];
                    this.cells[7]=undefined;
                    this.mover.roque(7, 5, source, dest);
                }
            }
            return;
        }else if((this.cells[source].type%16)==PION && abs(source-dest)==16){//Pion moved 2 squares, register possible en passant
            if(this.cells[source].type>15){//if white
                this.legal.enPassant=dest+8;
            }else{
                this.legal.enPassant=dest-8;
            }
        }
        this.move(source, dest);
    }
    
    move(source,dest){
        this.cells[dest]=this.cells[source];
        //[this.cells[dest].x, this.cells[dest].y ] = this.mover.getXYfromIndex(dest);
        //do not move directly, let move animate
        this.mover.addPath(source,dest);
        this.cells[source]=undefined;
        
    }
    
    capture(index){
        this.mover.storePiece(index);
        if(this.cells[index].type>15){//if white, goto left
            this.stFillIndexW.push(this.cells[index]);
        }else{
            this.stFillIndexB.push(this.cells[index]);
        }
        
        this.cells[index]=undefined;
    }
    /*
    setRealPiecePos(p){
        if(this.receivedPos==[]){//initialize at beginning
            this.receivedPos=p;
            return;
        }
        if(this.receivedPos==p)return;//if nothing has changed, return
        
        let foundChange=false;
        for(let i=0;i<this.receivedPos.length;i++){
            if(this.receivedPos[i]!=p[i]){//if board has changed
                if(foundChange){
                    console.log("error, multiple piece move!")
                    this.receivedPos=p;
                    return;
                }
                foundChange=true;
                
                if(p[i]=="0"){//piece has been lifted
                    if(this.cells[i]!=undefined){//moved an existing piece
                        if(this.WhiteTurn==(this.cells[i].type>15)){//active player piece was lifted
                            if(this.selectIndex>-1){
                                console.log("error, piece picked up while another piece was already selected")
                                this.receivedPos=p;
                                return;
                            }
                            //start of move, wait for placement
                            console.log("Player started move at "+i);
                            this.selectIndex=i;
                            this.legal.calculate(i);
                            
                        }else{//passive player piece moved, probably a capture
                            console.log("Player started capture at "+i);                            
                            //register capture
                        }
                    }else{
                        console.log("error, non-existing piece was lifted at "+i);
                    }
                }else{//piece has been placed
                    if(this.selectIndex>-1){//if piece was previously selected.
                        if(
                    }else{
                        console.log("error, piece placed at "+i+" while no piece was previously lifted")
                        this.receivedPos=p;
                        return;
                        
                    }
                }
                
            }
        }
        
    }*/
    
}
