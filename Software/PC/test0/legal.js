class Legal{
    constructor(c){
        this.cells=c;
        this.legalMoves=[];
        this.i=0;
        this.j=0;
        this.index=0;
        this.b=false;//true=black
        this.roqueStatus='KQkq'        
        this.enPassant=-1;
    }
    
    calculate(index){
        this.legalMoves=[];
        this.index=index;
        this.i=index%8;
        this.j=floor(index/8);
        this.b=this.cells[index].type<16;
        
        switch(this.cells[index].type%16){
            case PION:
                this.evalPion();
                break;
            case TOUR:
                this.evalStraight();
                break;
            case DAME:
                this.evalStraight();
            case FOU:
                this.evalDiag();
                break;
            case ROI:
                this.evalKing();
                break;
            case CAV:
                this.evalKnight();
                break;
        }
        //TODO restrict moves if king is checked
        
    }
    
    evalPion(){
        if(this.b){
            if(this.j<7){
                for(let a=max(0,this.i-1);a<=min(7,this.i+1);a++){
                    let index=a+(this.j+1)*8
                    //console.log(this.i, this.j,index)
                    if(this.cells[index]==undefined && a==this.i){
                        this.legalMoves.push(index);
                    }else if(this.cells[index]!=undefined && this.cells[index].type>15 && a!=this.i){//if diagonal with opponnent, TODO add en passant
                        this.legalMoves.push(index);                  
                    }
                }
                if(this.j==1 && this.cells[this.index+16]==undefined && this.cells[this.index+8]==undefined){//2 spaces from 1st row
                    this.legalMoves.push(this.index+16);  
                }
            }
        }else{
            if(this.j>0){
                for(let a=max(0,this.i-1);a<=min(7,this.i+1);a++){
                    let index=a+(this.j-1)*8
                    //console.log(this.i, this.j,index)
                    if(this.cells[index]==undefined && a==this.i){
                        this.legalMoves.push(index);
                    }else if(this.cells[index]!=undefined && this.cells[index].type<16 && a!=this.i){//if diagonal with opponnent, TODO add en passant
                        this.legalMoves.push(index);                  
                    }
                }
                if(this.j==6 && this.cells[this.index-16]==undefined && this.cells[this.index-8]==undefined){//2 spaces from 1st row
                    this.legalMoves.push(this.index-16);  
                }
            }
        }
        
        if(this.enPassant>-1 && (abs(this.enPassant-this.index)==7 || abs(this.enPassant-this.index)==9)){
            this.legalMoves.push(this.enPassant);
        }
        //console.log(this.legalMoves)
        
    }
    
    evalDiag(){
        let dirs=[[1,1],[-1,1],[1,-1],[-1,-1]];
        this.evalGeneric(dirs, 7);
    }
    evalStraight(){
        let dirs=[[1,0],[-1,0],[0,1],[0,-1]];
        this.evalGeneric(dirs, 7);
    }
    evalGeneric(dirs,maxInc){
        for(let dir=0;dir<dirs.length;dir++){
            let inc=1;
            let ci=this.i+inc*dirs[dir][0];
            let cj=this.j+inc*dirs[dir][1];
            
            while(ci>-1 && ci<8 && cj>-1 && cj<8){
                //console.log(ci,cj,ci+cj*8);
                if(this.cells[ci+cj*8]!=undefined){
                    if((this.cells[ci+cj*8].type<16)!=this.b){//if opposite color
                        this.legalMoves.push(ci+cj*8)
                    }
                    //console.log(ci+cj*8+" occupied")
                    break
                }else{//place is free
                    this.legalMoves.push(ci+cj*8)
                }
                inc++;
                if(inc>maxInc)break;
                ci=this.i+inc*dirs[dir][0];
                cj=this.j+inc*dirs[dir][1];
            }
        }
    }
    evalKing(){
        let dirs=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
        this.evalGeneric(dirs, 1);
        
        if(!this.b){
            if(this.cells[61]==undefined && this.cells[62]==undefined && this.roqueStatus.indexOf('K')!=-1){
            this.legalMoves.push(62);
            }
            if(this.cells[57]==undefined && this.cells[58]==undefined && this.cells[59]==undefined && this.roqueStatus.indexOf('Q')!=-1){
            this.legalMoves.push(58);
            }  
        }
        if(this.b){
            if(this.cells[5]==undefined && this.cells[6]==undefined && this.roqueStatus.indexOf('k')!=-1){
            this.legalMoves.push(6);
            }
            if(this.cells[1]==undefined && this.cells[2]==undefined && this.cells[3]==undefined && this.roqueStatus.indexOf('q')!=-1){
            this.legalMoves.push(2);
            } 
        }
    }
    
    evalKnight(){
        let dirs=[[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
        this.evalGeneric(dirs, 1);
        
    }
    
    
}
