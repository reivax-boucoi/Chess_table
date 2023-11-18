# This Python file uses the following encoding: utf-8

# if __name__ == "__main__":
#     pass

from enum import Enum,auto
import chess
import chess.svg

import CNC_interface
from CNC_interface import CNC_state
import Mover


class GameState(Enum):
    PLAYER_PENDING = auto()
    PLAYER_PLAYING = auto()
    PLAYER_PLAYED = auto()
    COMPUTER_THINKING = auto()
    COMPUTER_SELECTED = auto() #only used in manual computer playing.
    COMPUTER_PLAYING = auto()
    GAME_INIT = auto()
    GAME_FINISHED = auto()

class GameManager:
    gameStatus=GameState.COMPUTER_THINKING;
    board = chess.Board("rnbqkbnr/pppppp1p/8/6p1/7P/8/PPPPPPP1/RNBQKBNR w KQkq g6 0 2")
    cnc=CNC_interface.CNC_interface()
    mover=Mover.Mover(cnc.real_brd)
    boardSize=500
    boardMargin = 0.04 * boardSize
    squareSize = (boardSize - 2 * boardMargin) / 8.0
    svgWidget=None
    def __init__(self):
        pass

    def periodicUpdate(self):
        self.cnc.sendAsync(self.mover)
        if self.gameStatus==GameState.COMPUTER_PLAYING and not self.mover.isMoving: #was moving and is not finished
            self.board.push(self.mover.lastMoveUCI)
            self.gameStatus=GameState.COMPUTER_THINKING
            self.setBoardSVG()

    def svgClicked(self,x,y):
        if not(self.gameStatus==GameState.COMPUTER_THINKING or self.gameStatus==GameState.COMPUTER_SELECTED):
            return
        x-=10
        y-=38
        if self.boardMargin < x < self.boardSize - self.boardMargin and self.boardMargin < y < self.boardSize - self.boardMargin:
            file = int((x - self.boardMargin) / self.squareSize)
            rank = 7 - int((y - self.boardMargin) / self.squareSize)
            square = chess.square(file, rank)
            coordinates = "{}{}".format(chr(file + 97), str(rank + 1))
            #print("clicked!",square);
            if self.gameStatus==GameState.COMPUTER_SELECTED:

                #print("selected 2nd !",square, "1st:", self.pieceToMove[0]);
                if(coordinates!=self.mover.selectedPiece[1]):
                    move = chess.Move.from_uci("{}{}".format(self.mover.selectedPiece[1], coordinates))
                    if move in self.board.legal_moves:
                        self.mover.lastMoveUCI=move
                        if self.board.is_capture(move):
                            self.mover.addCapture(self.mover.selectedPiece[0],square)
                        else:
                            self.mover.addMove(self.mover.selectedPiece[0],square)
                        self.gameStatus=GameState.COMPUTER_PLAYING
                        self.cnc.sendAsync(self.mover)
                    else:
                        self.mover.selectedPiece = [None, None];
                        self.gameStatus=GameState.COMPUTER_THINKING
                        print("Move is illegal");
                else:
                    self.mover.selectedPiece = [None, None];
                    self.gameStatus=GameState.COMPUTER_THINKING
                    print("source and dest are identical");

            elif(self.board.turn!=self.board.color_at(square)):
                self.mover.selectedPiece = [None, None];
                self.gameStatus=GameState.COMPUTER_THINKING
                print("not allowed to select opposite color");
            else:
                #print("selected 1st !",square);
                self.gameStatus=GameState.COMPUTER_SELECTED
                self.mover.selectedPiece = [square, coordinates]


    def setBoardSVG(self):
        if self.gameStatus==GameState.COMPUTER_PLAYING:
            boardSvg = chess.svg.board(self.board,
            arrows=[chess.svg.Arrow(self.mover.lastMove[0], self.mover.lastMove[1], color="#0000cc")],
            size=self.boardSize).encode("UTF-8");
        elif self.gameStatus==GameState.COMPUTER_SELECTED:
                    possible_moves=list(self.board.legal_moves)
                    possible_moves_from_selected=list(map(lambda x:x.to_square,filter(lambda x:x.from_square==self.mover.selectedPiece[0],possible_moves)))

                    boardSvg = chess.svg.board(self.board,
                                                    fill=dict.fromkeys(possible_moves_from_selected, "#cc0000cc") |
                                                    {self.mover.selectedPiece[0]:"#cc00cc"},

                                                    size=self.boardSize
                                                    ).encode("UTF-8");
        else:
            boardSvg = chess.svg.board(self.board,
            size=self.boardSize).encode("UTF-8");
        self.svgWidget.load(boardSvg)
