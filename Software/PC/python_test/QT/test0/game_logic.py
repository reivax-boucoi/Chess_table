# This Python file uses the following encoding: utf-8

# if __name__ == "__main__":
#     pass

from enum import Enum,auto
import chess
import chess.svg

import CNC_interface
import Mover


class GameState(Enum):
    PLAYER_PENDING = auto()
    PLAYER_PLAYING = auto()
    PLAYER_PLAYED = auto()
    COMPUTER_THINKING = auto()
    COMPUTER_PLAYING = auto()
    GAME_INIT = auto()
    GAME_FINISHED = auto()

class GameManager:
    gameStatus=GameState.COMPUTER_THINKING;
    board = chess.Board()
    cnc=CNC_interface.CNC_interface()
    mover=Mover.Mover(cnc.real_brd)

    def __init__(self):
        pass
