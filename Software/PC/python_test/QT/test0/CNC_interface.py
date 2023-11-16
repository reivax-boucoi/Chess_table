# This Python file uses the following encoding: utf-8

import serial
import serial.tools.list_ports
from enum import Enum,auto
import time
import Board


class CNC_state(Enum):
    DISCONNECTED = auto()
    CONNECTED = auto()
    HOMED = auto()

class CNC_interface:
    cnc=None
    status=CNC_state.DISCONNECTED
    hall_effect_brd= Board.Board()
    real_brd=Board.Board()
    machine_coords={"x0":-7,"y0":-297,"w":-35}
    awaitingResponse=False;

    def __init__(self):
        pass

    def CNC_connect(self):
        try:
            plist=serial.tools.list_ports.comports()
            plist=list(filter(lambda x:'rfcomm' in x.device,plist))
            if(len(plist)==0):
                return "No rfcomm port detected"
            self.cnc=serial.Serial(plist[0].device, 115200, timeout=1)
        except:
            self.cnc=None
            return "CNC failed to connect to "+plist[0].device

        else:
            self.cnc.flush();
            self.status=CNC_state.CONNECTED
            return "CNC connection successful"

    def CNC_initialize(self):
        self.cnc.flush();
        self.cnc.write(b'$H\r\nS1000\r\nG1 F1000\r\n')
        while(self.cnc.in_waiting==0):
            time.sleep(0.5)
            print("wait for home sequence")
        self.status=CNC_state.HOMED
        #print("$H\r\nS1000\r\nG1 F1000\r\n")

    def CNC_close(self):
        self.cnc.close()
        self.status=CNC_state.DISCONNECTED

    def sendMachinePos(self, p):
        x= (p.x*self.machine_coords["w"]) + self.machine_coords["x0"];
        y= -(p.y*self.machine_coords["w"]) + self.machine_coords["y0"];
        if(x>0 or x<-370):
            print("X",x, "out of bounds")
            x=max(min(x,0),-370)
        if(y>0 or y<-315):
            print("Y",y, "out of bounds")
            y=max(min(y,0),-315)
        cmd="X%.2f"%x+"Y%.2f"%y+"\n"
        print("GCODE",p.x,p.y, cmd[:-1])
        self.cnc.write(str.encode(cmd))

    def  sendMove(self,m):
        if m.isMoving:
            self.awaitingResponse=True
            p=m.getNextMove()
            if p=="ON":
                self.cnc.write(b"M3\n")
                print("GCODE magnet ON")
            elif p=="OFF":
                self.cnc.write(b"M5\n")
                print("GCODE magnet OFF")
            else:
                self.sendMachinePos(p)
        else:
            self.awaitingResponse=False

    def sendAsync(self,m):
        if(self.status is not CNC_state.HOMED):
            print("poll whilst not init")
            return 0


        if self.cnc.in_waiting>0:
            response=self.cnc.readline()
            if b'<' in response:
                s=self.parseStatus(response);
                self.parseHallEffect(s[2],self.hall_effect_brd)
                print("status parse")
            elif b'ok' not in response:
                print("CNC responded",response)
            else:
                self.sendMove(m)

        elif not self.awaitingResponse:
                self.sendMove(m)

    def CNC_getHall(self):
        for i in range(0,8):
            self.cnc.write(b'?')     # write a string
        self.awaitingResponse=True


    def parseStatus(self,r):
        r=r[1:-3].split(b'|')
        status=r[0] #Idle, Run, Alarm
        for s in r[1:]:
            s=s.split(b':')
            if(s[0]==b'MPos'):
                pos=s[1].split(b',')
            elif(s[0]==b'He'):
                inputs=s[1]
           # else:
           #     print(s)
        return [status, pos, inputs]

    def parseHallEffect(self,s,b):
        col=1+((s[0]-65+6)%8); #65='A'
        row=0
        for i in range(0,4):
            row+=(s[i+1]-97)<<(4*(3-i));
        row=row>>5
        pieceCounter=0
        for i in range(0,11):
            if(row&(1<<i)==0):
                #print("col ",col," inserting at ",i)
                b.squareState[col][i]=1
                pieceCounter+=1
            else:
                b.squareState[col][i]=0
        #print("col ",col," found ",pieceCounter," pieces")
        return 'b'

    def printBoard(self,b):
        for c in b.squareState:
            print(c);
