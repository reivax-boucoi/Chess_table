# This Python file uses the following encoding: utf-8

# if __name__ == "__main__":
#     pass

class Coords:
    x=0
    y=0
    def __init__(self,x,y=None):
        if y is None: # Provided index, i.e 0=(0,0)=A1, 63=(7,7)=H8
            self.x=x%8
            self.y=int(x/8)
        else:   #Provided x & y directly
            self.x=x
            self.y=y

    def __sub__(self,other):
        res=Coords(self.x,self.y)
        res.x-=other.x
        res.y-=other.y
        return res

    def __add__(self,other):
        res=Coords(self.x,self.y)
        res.x+=other.x
        res.y+=other.y
        return res

    def getMag(self):
        return (self.x*self.x+self.y*self.y)**0.5

    def setMag(self,mag):
        factor=mag/self.getMag()
        return Coords(self.x*factor,self.y*factor)
