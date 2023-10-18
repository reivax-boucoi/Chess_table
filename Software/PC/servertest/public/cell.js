class Cell{
    constructor(x,y,c,w){
        this.type=c;
        this.w=w;
        this.x=x;
        this.y=y;
        
    }
    show(){
        let margin=5;
        if(this.type<16){
            stroke(255)
            fill(0);
        }else{
            stroke(0)
            fill(255);            
        }
        strokeWeight(2);
        textSize(this.w);
        textAlign(CENTER, CENTER);
        text(Piece_symbol[(this.type%16)-1],this.x , this.y+3);
    }
    
}
