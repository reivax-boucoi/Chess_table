class Mover{
    constructor(b){
        this.board=b;
        this.path=undefined;//queue of submoves
        this.paths=[];//queue of all moves
        this.lerp=0;
        this.increment=0;
        this.cell=[];//queue of cells to be moved
        this.headpos=[100,100];//target pos
        this.headActive=false;
        this.showPath=true;
        
        this.showHead=true;
        this.headLoc=[150,150];//real head pos
        
        this.socket=undefined;
        
        this.compensation=0.2;
    }
    show(){
        strokeWeight(3);
        if(this.showPath){
            if(this.path){
                stroke(255,0,0);
                for(let i=0;i<this.path.length-1;i++){
                    if(i==0){
                        line(this.cell[0].x,this.cell[0].y,this.path[i+1][0],this.path[i+1][1]);
                    }else{
                        line(this.path[i][0],this.path[i][1],this.path[i+1][0],this.path[i+1][1]);
                    }
                }
                stroke(0,255,0);
                for(let i=0;i<this.paths.length;i++){
                    let p=this.paths[i];
                    for(let j=0;j<p.length-1;j++){
                        line(p[j][0],p[j][1],p[j+1][0],p[j+1][1]);
                    }
                }
            }
            noFill()
            if(this.headActive){
                stroke(255,0,0,127);
            }else{
                stroke(0,0,255,127);
            }
            ellipse(this.headpos[0],this.headpos[1],this.board.w*0.7,this.board.w*0.7);
        }
        
        if(this.showHead){
            noFill()
            strokeWeight(3);
            if(this.headActive){
                stroke(255,0,0);
            }else{
                stroke(0,0,255);
            }
            ellipse(this.headLoc[0],this.headLoc[1],this.board.w*0.8,this.board.w*0.8);
        }
        strokeWeight(1);
        
    }
    update(){
        if(this.path){
            this.lerp+=this.increment;
            if(this.lerp>=1){//jump to next segment
                this.headActive=true;
                this.path.shift();
                this.lerp=0;
                if(this.path.length==1){//if last segment, cleanup mover
                    this.headpos=this.path[0];
                    this.headActive=false;
                    this.cell[0].x=this.path[0][0];
                    this.cell[0].y=this.path[0][1];
                    this.path=this.paths.shift();
                    if(this.path){
                        this.path.unshift([this.headpos[0],this.headpos[1]]);
                        this.setSpeed();
                    }
                    this.cell.shift();
                    return;
                }
                this.setSpeed();
            }
            
            this.headpos[0]=lerp(this.path[0][0],this.path[1][0],this.lerp);
            this.headpos[1]=lerp(this.path[0][1],this.path[1][1],this.lerp);
            if(this.headActive){
                this.cell[0].x=lerp(this.path[0][0],this.path[1][0],this.lerp);
                this.cell[0].y=lerp(this.path[0][1],this.path[1][1],this.lerp);
            }
        }
    }
    
    getXYfromIndex(index){
        let x=this.board.w*((index%8)+0.5)+this.board.loff
        let y=this.board.w*(floor(index/8)+0.5)+this.board.toff
        return [x,y];   
    }
    
    getlastSTXY(b){
        const ymap=[0.5,7.5,1.5,6.5,2.5,5.5,3.5,4.5];
        if(b){
            return [board.stLoffB+this.board.w*(0.5+(board.stFillIndexB.length%2?0:1)) , 
            this.board.stToffB+ymap[floor(this.board.stFillIndexB.length/2)]*this.board.w];
        }
        return [board.stLoffW+this.board.w*(0.5+(board.stFillIndexW.length%2?1:0)) , 
        this.board.stToffW+ymap[floor(this.board.stFillIndexW.length/2)]*this.board.w];   
    }
    
    getSTentryXY(b){
        if(b)return [this.board.stLoffB+this.board.w*0.5, board.stToffB+this.board.w*3.5];
        return [this.board.stLoffW+this.board.w*1.5, this.board.stToffW+this.board.w*4.5];
    }
    
    setSpeed(){
     this.increment=2/sqrt(pow(this.path[1][1]-this.path[0][1],2)+pow(this.path[1][0]-this.path[0][0],2));
    }
    
    addPath(source,dest){
        let p=[]
        this.cell.push(board.cells[dest]);
        //if(this.path==undefined){
            p.push([this.headpos[0],this.headpos[1]]);
        //}
        p.push(this.getXYfromIndex(source));
        
        if(this.cell[this.cell.length-1].type%16==CAV){
            let [xs,ys]=p[p.length-1];
            let [xd,yd]=this.getXYfromIndex(dest);
            let xinc=xd-xs;
            let yinc=yd-ys;
            if(abs(xinc)<abs(yinc)){//1/2 move x, then y, then 1/2 x
                let yf=((yinc<0)?-1:1)*0.5*this.board.w
                p.push([xs+0.5*xinc,ys+yf]);
                p.push([xs+0.5*xinc,yd-yf]);
            }else{
                let xf=((xinc<0)?-1:1)*0.5*this.board.w
                p.push([xs+xf,ys+0.5*yinc]);
                p.push([xd-xf,ys+0.5*yinc]);
            }
        }
        p.push(this.getXYfromIndex(dest));
        this.sendPath(p);
        this.paths.push(p);//add to move queue
        if(this.path==undefined){//if 1st move, execute now
            this.path=this.paths.shift();
            this.setSpeed();
        }
    }
    roque(as,ad,bs,bd){
        this.addPath(as,ad);
        this.cell.push(board.cells[bd]);
        let [xs,ys]=this.getXYfromIndex(bs)
        let [xd,yd]=this.getXYfromIndex(bd)
        let p=[]
        p.push([xs,ys]);
        let xinc=((xd<xs)?-1:1)*0.5*this.board.w;
        let yinc=(board.cells[bd].type<16?-1:1)*0.5*this.board.w;
        p.push([xs+xinc,ys+yinc]);
        p.push([xd-xinc,ys+yinc]);
        p.push([xd,ys]);
       this.paths.push(p);
    }
    
    storePiece(index){
        let p=[]
        this.cell.push(board.cells[index]);
        //if(this.path==undefined){
            p.push([this.headpos[0],this.headpos[1]]);
        //}
        let [xs,ys]=this.getXYfromIndex(index);
        let [xe,ye]=this.getSTentryXY(board.cells[index].type<16);
        let xdir=this.board.w/2*(xe>xs?1:-1);
        let ydir=this.board.w/2*(ye>ys?1:-1);
        p.push([xs, ys]);//get to piece
        p.push([xs+xdir, ys+ydir]);//move between lines
        p.push([xe-xdir*2, ys+ydir]);//traverse between lines
        p.push([xe-xdir*2, ye]);//get in front of storage entrance
        p.push([xe, ye]);//get to storage entrance
        p.push(this.getlastSTXY(board.cells[index].type<16));//get to storage loc
        
        this.paths.push(p);//add to move queue
        this.sendPath(p);
        if(this.path==undefined){//if 1st move, execute now
            this.path=this.paths.shift();
            this.setSpeed();
        }
        
    }
    
    sendPath(p){
     this.sendMove(p[1]);
     this.socket.emit('path', { "magnet":"ON"});
     console.log("M3");
     for(let i=2;i<p.length-1;i++){
        this.sendMove(p[i]);   
     }
     let a=createVector(p[p.length-2][0],p[p.length-2][1]);
     let b=createVector(p[p.length-1][0],p[p.length-1][1]);
     let d=p5.Vector.sub(b,a).setMag(this.compensation*this.board.w)
     b.add(d);
     this.sendMove([b.x,b.y]);
     this.socket.emit('path', { "magnet":"OFF"});
     console.log("M5");
     
    }
    sendMove(coords){
        let i=(coords[0]-this.board.loff)/this.board.w;
        let j=(coords[1]-this.board.toff)/this.board.w;      
        this.socket.emit('path', { "move":[i,j] });
        console.log([i,j]);
    }
    
}
    
