# This Python file uses the following encoding: utf-8


class Board:

    squareState=[[0]*11 for i in range(9)]
    nbPieces=0
    storageIndex=0

    def __init__(self):
        pass
    def getPieceCount(self):
        nb_pieces=0
        for r in self.squareState:
            for s in r:
                if s>0:
                    nb_pieces+=1
        return nb_pieces
