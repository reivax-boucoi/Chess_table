//const TOUR=1, CAV=2,FOU=3,DAME=4, ROI=5, PION=6;
//FEN format: 6 fields separated by a space:
//1: Placement
//2: Active color (w=white turn)
//3: castling availability (- for none)
//4: en passant (- for none)
//5: 1/2 move clock
//6: number of full moves (start=1, incremet after black)
//pawn = "P", knight = "N", bishop = "B", rook = "R", queen = "Q" and king = "K"
//white=uppercase, black lowercase
const TOUR=1, CAV=2,FOU=3,DAME=4, ROI=5, PION=6;
const Piece_symbol=['♜','♞','♝','♛','♚','♟'];

function getIndexFromName(name){
    return name.charCodeAt(0) - 97 + (8 - int(name[1])) * 8;
}
function getNameFromIndex(index){
    return  'abcdefgh'.charAt(index%8) + '12345678'.charAt(7-floor(index/8));
}

function getMoveIndices(name){
    //if length 2 : pawn move
    //Be5 : bishop has moved to e5
    //if char[2]=='x' capture
    //long form: sourcedest
    return  [getIndexFromName(name.substring(0,2)),getIndexFromName(name.substring(2,4))];
}

function getMoveName(source, dest){
    return  getNameFromIndex(source)+getNameFromIndex(dest);
}

//FEN format: 6 fields separated by a space:
//1: Placement
//2: Active color (w=white turn)
//3: castling availability (- for none)
//4: en passant (- for none)
//5: 1/2 move clock
//6: number of full moves (start=1, increment after black)
//pawn = "P", knight = "N", bishop = "B", rook = "R", queen = "Q" and king = "K"
//white=uppercase, black lowercase
function getFEN(board){
    let output='';
    let spacecount=0;
    for(let i=0;i<64;i++){
        if(i%8==0 && i>0){
            if(spacecount>0){
                output+=spacecount;
                spacecount=0;
            }
            output+='/';
        }
        if(board.cells[i]==undefined){
            spacecount+=1;
        }else{
            if(spacecount>0){
                output+=spacecount;
                spacecount=0;
            }
            output+=' rnbqkp          RNBQKP'.charAt(board.cells[i].type)
        }
    }
    if(board.legal.roqueStatus=='')board.legal.roqueStatus='-';
    
    output+=' '+(board.WhiteTurn?'w':'b')+' '+ board.legal.roqueStatus +' '+(board.legal.enPassant>-1?getNameFromIndex(board.legal.enPassant):'-')+' 0 '+board.nbFullMoves;
    return output;
}
function setFEN(fen,board){
    board.stFillIndexW=[];
    board.stFillIndexB=[];
    board.cells.length=0;
    
    fen=fen.split(' ');
    fen[0]=fen[0].replaceAll('/','');
    console.table(fen)
    let index=0;
    for(let i=0;i<fen[0].length;i++){
        let c=fen[0].at(i);
        if (c >= '0' && c <= '9') {
            index+=int(c);
        } else {
            let [x,y] = board.mover.getXYfromIndex(index);
            let typ = ' rnbqkp'.indexOf(c.toLowerCase())+16*(c.toLowerCase()==c?0:1);
            board.cells[index]=new Cell(x,y,typ,board.w)//TODO
            index++;
        }
    }
    board.WhiteTurn=fen[1].toLowerCase()=='w';
    board.legal.roqueStatus=fen[2];
    board.legal.enPassant=(fen[3]=='-'?-1:getIndexFromName(fen[3]));
    board.nbFullMoves=fen[fen.length-1];
}
