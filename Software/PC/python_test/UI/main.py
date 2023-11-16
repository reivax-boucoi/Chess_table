#! /usr/bin/env python

"""
This module is the execution point of the chess GUI application.
"""

import sys

import chess
import chess.svg
from enum import Enum,auto
import serial
import time

from PyQt5.QtCore import pyqtSlot, Qt
from PyQt5.QtSvg import QSvgWidget
from PyQt5.QtWidgets import QApplication, QWidget

class GameState(Enum):
    PLAYER_PENDING = auto()
    PLAYER_PLAYING = auto()
    PLAYER_PLAYED = auto()
    COMPUTER_THINKING = auto()
    COMPUTER_PLAYING = auto()
    GAME_INIT = auto()
    GAME_FINISHED = auto()


class MainWindow(QWidget):
    """
    Create a surface for the chessboard.
    """
    def __init__(self):
        """
        Initialize the chessboard.
        """
        super().__init__()

        self.setWindowTitle("Chess GUI")
        self.setGeometry(50, 50, 800, 600)

        self.widgetSvg = QSvgWidget(parent=self)
        self.widgetSvg.setGeometry(0, 0, 600, 600)

        self.boardSize = min(self.widgetSvg.width(),
                             self.widgetSvg.height())
        self.coordinates = True
        self.margin = 0.05 * self.boardSize if self.coordinates else 0
        self.squareSize = (self.boardSize - 2 * self.margin) / 8.0
        self.pieceToMove = [None, None];
        self.destination = [None, None];
        self.gameStatus=GameState.COMPUTER_THINKING;

        self.board = chess.Board()
        self.drawBoard()

    @pyqtSlot(QWidget)
    def mousePressEvent(self, event):
        """
        Handle left mouse clicks and enable moving chess pieces by
        clicking on a chess piece and then the target square.

        Moves must be made according to the rules of chess because
        illegal moves are suppressed.
        """
        if(self.gameStatus!=GameState.COMPUTER_THINKING):
            return
        if event.x() <= self.boardSize and event.y() <= self.boardSize:
            if event.buttons() == Qt.LeftButton:
                if self.margin < event.x() < self.boardSize - self.margin and self.margin < event.y() < self.boardSize - self.margin:
                    file = int((event.x() - self.margin) / self.squareSize)
                    rank = 7 - int((event.y() - self.margin) / self.squareSize)
                    square = chess.square(file, rank)
                    coordinates = "{}{}".format(chr(file + 97), str(rank + 1))
                    #print("clicked!",square);
                    if self.pieceToMove[0] is not None:
                        #print("selected 2nd !",square, "1st:", self.pieceToMove[0]);
                        if(coordinates!=self.pieceToMove[1]):
                            move = chess.Move.from_uci("{}{}".format(self.pieceToMove[1], coordinates))
                            if move in self.board.legal_moves:
                                self.destination=[square, coordinates]
                                self.gameStatus=GameState.COMPUTER_PLAYING
                                #print("Move legal !");
                                #self.board.push(move)
                            else:
                                self.pieceToMove = [None, None];
                                print("Move is illegal");
                        else:
                            self.pieceToMove = [None, None];
                            print("source and dest are identical");
                    
                    elif(self.board.turn!=self.board.color_at(square)):
                        self.pieceToMove = [None, None];
                        print("not allowed to select own color");
                    else:
                        print("selected 1st !",square);
                        self.pieceToMove = [square, coordinates]
                    self.drawBoard()

    def drawBoard(self):
        """
        Draw a chessboard with the starting position and then redraw
        it for every new move.
        """
        print("draw")
        if self.gameStatus==GameState.COMPUTER_PLAYING:
            print(self.pieceToMove, self.destination);
            self.boardSvg = chess.svg.board(self.board,
                                            arrows=[chess.svg.Arrow(self.pieceToMove[0], self.destination[0], color="#0000cc")],
                                            size=self.widgetSvg.width()
                                            ).encode("UTF-8");           
            
        elif self.pieceToMove[0] is not None:
            #print(self.pieceToMove)
            possible_moves=list(self.board.legal_moves)
            possible_moves_from_selected=list(map(lambda x:x.to_square,filter(lambda x:x.from_square==self.pieceToMove[0],possible_moves)))
                        
            self.boardSvg = chess.svg.board(self.board,
                                            fill=dict.fromkeys(possible_moves_from_selected, "#cc0000cc") | 
                                            {self.pieceToMove[0]:"#cc00cc"},
                                            
                                            size=self.widgetSvg.width()
                                            ).encode("UTF-8");
            
        else:
            self.boardSvg = chess.svg.board(self.board,
                                            size=self.widgetSvg.width()
                                            ).encode("UTF-8");
            
        self.drawBoardSvg = self.widgetSvg.load(self.boardSvg)

        return self.drawBoardSvg


if __name__ == "__main__":
    chessGui = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(chessGui.exec_())
