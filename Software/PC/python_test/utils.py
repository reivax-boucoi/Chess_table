
def parseStatus(r):
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
    
def parseHallEffect(s,b):
    col=1+((s[0]-65+6)%8); #65='A'
    row=0
    for i in range(0,4):
        row+=(s[i+1]-97)<<(4*(3-i));
    row=row>>5
    
    for i in range(0,11):
        if(row&(1<<i)==0):
            #print("col ",col," inserting at ",i)
            b[col][i]=1
        else:
            b[col][i]=0
    #print("col ",col," found ",pieceCounter," pieces")
    return 'b'

def printBoard(b):
    for c in b:
        print(c);
        
