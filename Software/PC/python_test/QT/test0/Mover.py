# This Python file uses the following encoding: utf-8

import utils

class Mover:
    isMoving=False
    path=[]
    brd=None
    dragCompensation=0.15
    lastMove=[]
    lastMoveUCI=None
    selectedPiece=[None, None]

    def __init__(self, brd):
        self.brd=brd

    def addMove(self, s,d):
        self.lastMove=[s,d]
        if not isinstance(s,utils.Coords):
            s=utils.Coords(s)
        if not isinstance(d,utils.Coords):
            d=utils.Coords(d)

        self.path.append(s)
        self.path.append("ON")
        dx=d.x-s.x
        dy=d.y-s.y
        if not(abs(dx)==abs(dy) or dx==0 or dy==0):
            #not a straight line
            if abs(dx)<abs(dy):#1/2 move x, then y, then 1/2 x
                if dy<0:
                    ytemp=-0.5
                else:
                    ytemp=0.5
                self.path.append(utils.Coords(s.x+dx/2,s.y+ytemp));
                self.path.append(utils.Coords(d.x-dx/2,d.y-ytemp));
            else:
                if dx<0:
                    xtemp=-0.5
                else:
                    xtemp=0.5
                self.path.append(utils.Coords(s.x+xtemp,s.y+dy/2));
                self.path.append(utils.Coords(d.x-xtemp,d.y-dy/2));

            comp=(d-self.path[-1]).setMag(self.dragCompensation)+d
        else:
            comp=(d-self.path[-2]).setMag(self.dragCompensation)+d #use command before "ON" as source

        self.path.append(comp)
        self.path.append("OFF")
        self.isMoving=True
        #self.printPath()

    def getStorageLoc(self):
        if self.brd.storageIndex<8:
            x=10
        else:
            x=9
        return utils.Coords(x, self.brd.storageIndex%8)

    def addCapture(self, s,d):
        self.lastMove=[s,d]
        d_c=utils.Coords(d)
        self.addStorageMove(d_c,self.getStorageLoc())
        self.brd.storageIndex+=1
        if self.brd.storageIndex>15:
            raise OverflowError("Capture buffer is full")
        self.addMove(s,d)

    def addStorageMove(self,s,d):
        self.path.append(s)
        self.path.append("ON")

        if(d.y>s.y):
            self.path.append(s+utils.Coords(0.5,0.5))
            self.path.append(utils.Coords(8.5,s.y+0.5))
            self.path.append(utils.Coords(8.5,d.y-0.5))
        else:
            self.path.append(s+utils.Coords(0.5,-0.5))
            self.path.append(utils.Coords(8.5,s.y-0.5))
            self.path.append(utils.Coords(8.5,d.y+0.5))

        comp=(d-self.path[-1]).setMag(self.dragCompensation)+d
        self.path.append(comp)
        self.path.append("OFF")
        self.isMoving=True

    def getNextMove(self):
        if self.isMoving==False:
            return None
        else:
            elt=self.path.pop(0)
            if len(self.path)==0:
                self.isMoving=False
            return elt

    def printPath(self):
        for elt in self.path:
            if isinstance(elt,utils.Coords):
                print("[",elt.x,",",elt.y,"]")
            else:
                print(elt)
