import serial
import time
import utils
from enum import auto
import chess
import chess.svg


class GameState(Enum):
    PLAYER_PENDING = auto()
    PLAYER_PLAYING = auto()
    PLAYER_PLAYED = auto()
    COMPUTER_THINKING = auto()
    COMPUTER_PLAYING = auto()
    GAME_INIT = auto()
    GAME_FINISHED = auto()
    

cnc = serial.Serial('/dev/rfcomm0', 115200, timeout=1)  # open serial port

hall_effect_brd= [[0]*11 for i in range(9)]


cnc.flush();

board = chess.Board("r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4")
chess.svg.board(

    board,
    fill=dict.fromkeys(board.attacks(chess.E4), "#cc0000cc"),
    arrows=[chess.svg.Arrow(chess.E4, chess.F6, color="#0000cccc")],
    squares=chess.SquareSet(chess.BB_DARK_SQUARES & chess.BB_FILE_B),
    size=350,

) 
while True:

    for i in range(0,8):
        cnc.write(b'?')     # write a string
        s=utils.parseStatus(cnc.readline());
        h=utils.parseHallEffect(s[2],hall_effect_brd)
    print("scan complete")
    #utils.printBoard(hall_effect_brd)
    time.sleep(1);
cnc.close()             # close port


#find_move(from, to )
