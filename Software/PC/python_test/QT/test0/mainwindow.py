# This Python file uses the following encoding: utf-8
import sys

from PySide6.QtWidgets import QApplication, QMainWindow
from PySide6.QtSvgWidgets import QSvgWidget
from PySide6.QtGui import QMouseEvent
from PySide6.QtCore import QTimer
from PySide6.QtCore import Qt
#from PySide6.QtCore.Qt import MouseButton

# Important:
# You need to run the following command to generate the ui_form.py file
#     pyside6-uic form.ui -o ui_form.py, or
#     pyside2-uic form.ui -o ui_form.py
from ui_form import Ui_MainWindow
import game_logic
from CNC_interface import CNC_state


class MainWindow(QMainWindow):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)
        self.timer = QTimer(self)
        self.timer.timeout.connect( self.periodicTimer)
        self.timer.start(250)
        self.svgWidget = QSvgWidget(self.ui.horizontalLayoutWidget)
        self.svgWidget.setMinimumHeight(500)
        self.svgWidget.setMinimumWidth(500)
        self.svgWidget.setVisible(True)
        self.svgWidget.mouseReleaseEvent=self.svgWidget_clicked
        #widgetSvg = QSvgWidget(parent=self.ui.mySVGWidget)

    def svgWidget_clicked(self,event):
        clickPt=event.globalPosition()-self.pos()
        gm.svgClicked(clickPt.x(),clickPt.y())
        gm.setBoardSVG()
        event.accept()

    def SMNext_buttonPressed(self):
        #gm.cnc.CNC_initialize()
        pass

    def PlayerGo_buttonPressed(self):
        gm.cnc.CNC_getHall()
        gm.cnc.printBoard(gm.cnc.hall_effect_brd)
        print("Board piece count:",gm.cnc.hall_effect_brd.getPieceCount())

    def CNCcon_buttonPressed(self):
        if gm.cnc.status is CNC_state.DISCONNECTED:
            r=gm.cnc.CNC_connect()
            if gm.cnc.status is CNC_state.DISCONNECTED:
                self.ui.CNCcon_button.setText("Connect retry")
                print(r)
            else:
                self.ui.CNCcon_button.setText("Home")
        elif gm.cnc.status is CNC_state.CONNECTED:
            gm.cnc.CNC_initialize()
            self.ui.CNCcon_button.setText("Disconnect")
        elif gm.cnc.status is CNC_state.HOMED:
            gm.cnc.CNC_close()
            self.ui.CNCcon_button.setText("Reconnect")

    def periodicTimer(self):
        gm.periodicUpdate()
        self.ui.SMState_label.setText(gm.gameStatus.name)
        self.repaint()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    gm=game_logic.GameManager()
    widget = MainWindow()
    gm.svgWidget=widget.svgWidget
    gm.setBoardSVG()
    widget.show()
    sys.exit(app.exec())
