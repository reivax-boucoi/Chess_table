# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'form.ui'
##
## Created by: Qt User Interface Compiler version 6.6.0
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide6.QtCore import (QCoreApplication, QDate, QDateTime, QLocale,
    QMetaObject, QObject, QPoint, QRect,
    QSize, QTime, QUrl, Qt)
from PySide6.QtGui import (QBrush, QColor, QConicalGradient, QCursor,
    QFont, QFontDatabase, QGradient, QIcon,
    QImage, QKeySequence, QLinearGradient, QPainter,
    QPalette, QPixmap, QRadialGradient, QTransform)
from PySide6.QtWidgets import (QApplication, QGridLayout, QHBoxLayout, QLabel,
    QMainWindow, QPushButton, QSizePolicy, QStatusBar,
    QWidget)

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        if not MainWindow.objectName():
            MainWindow.setObjectName(u"MainWindow")
        MainWindow.resize(800, 600)
        icon = QIcon()
        iconThemeName = u"face-smile"
        if QIcon.hasThemeIcon(iconThemeName):
            icon = QIcon.fromTheme(iconThemeName)
        else:
            icon.addFile(u".", QSize(), QIcon.Normal, QIcon.Off)

        MainWindow.setWindowIcon(icon)
        self.centralwidget = QWidget(MainWindow)
        self.centralwidget.setObjectName(u"centralwidget")
        self.centralwidget.setAutoFillBackground(False)
        self.horizontalLayoutWidget = QWidget(self.centralwidget)
        self.horizontalLayoutWidget.setObjectName(u"horizontalLayoutWidget")
        self.horizontalLayoutWidget.setGeometry(QRect(10, 10, 781, 502))
        self.horizontalLayout_2 = QHBoxLayout(self.horizontalLayoutWidget)
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.horizontalLayout_2.setContentsMargins(0, 0, 0, 0)
        self.svgWidget = QWidget(self.horizontalLayoutWidget)
        self.svgWidget.setObjectName(u"svgWidget")
        self.svgWidget.setMinimumSize(QSize(500, 500))

        self.horizontalLayout_2.addWidget(self.svgWidget)

        self.gridLayout = QGridLayout()
        self.gridLayout.setObjectName(u"gridLayout")
        self.SMNext_button = QPushButton(self.horizontalLayoutWidget)
        self.SMNext_button.setObjectName(u"SMNext_button")

        self.gridLayout.addWidget(self.SMNext_button, 1, 0, 1, 1)

        self.SMState_label = QLabel(self.horizontalLayoutWidget)
        self.SMState_label.setObjectName(u"SMState_label")
        sizePolicy = QSizePolicy(QSizePolicy.Preferred, QSizePolicy.Preferred)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.SMState_label.sizePolicy().hasHeightForWidth())
        self.SMState_label.setSizePolicy(sizePolicy)
        self.SMState_label.setMinimumSize(QSize(0, 0))

        self.gridLayout.addWidget(self.SMState_label, 1, 1, 1, 1)

        self.HEstate_label = QLabel(self.horizontalLayoutWidget)
        self.HEstate_label.setObjectName(u"HEstate_label")
        sizePolicy1 = QSizePolicy(QSizePolicy.Maximum, QSizePolicy.Maximum)
        sizePolicy1.setHorizontalStretch(0)
        sizePolicy1.setVerticalStretch(0)
        sizePolicy1.setHeightForWidth(self.HEstate_label.sizePolicy().hasHeightForWidth())
        self.HEstate_label.setSizePolicy(sizePolicy1)
        self.HEstate_label.setMinimumSize(QSize(0, 0))

        self.gridLayout.addWidget(self.HEstate_label, 2, 1, 1, 1)

        self.PlayerGo_button = QPushButton(self.horizontalLayoutWidget)
        self.PlayerGo_button.setObjectName(u"PlayerGo_button")

        self.gridLayout.addWidget(self.PlayerGo_button, 2, 0, 1, 1)

        self.CNCcon_button = QPushButton(self.horizontalLayoutWidget)
        self.CNCcon_button.setObjectName(u"CNCcon_button")

        self.gridLayout.addWidget(self.CNCcon_button, 0, 0, 1, 1)


        self.horizontalLayout_2.addLayout(self.gridLayout)

        MainWindow.setCentralWidget(self.centralwidget)
        self.statusbar = QStatusBar(MainWindow)
        self.statusbar.setObjectName(u"statusbar")
        MainWindow.setStatusBar(self.statusbar)

        self.retranslateUi(MainWindow)
        self.SMNext_button.clicked.connect(MainWindow.SMNext_buttonPressed)
        self.PlayerGo_button.clicked.connect(MainWindow.PlayerGo_buttonPressed)
        self.CNCcon_button.clicked.connect(MainWindow.CNCcon_buttonPressed)

        QMetaObject.connectSlotsByName(MainWindow)
    # setupUi

    def retranslateUi(self, MainWindow):
        MainWindow.setWindowTitle(QCoreApplication.translate("MainWindow", u"Chess GUI", None))
        self.SMNext_button.setText(QCoreApplication.translate("MainWindow", u"SM Next", None))
        self.SMState_label.setText(QCoreApplication.translate("MainWindow", u"SM State", None))
        self.HEstate_label.setText(QCoreApplication.translate("MainWindow", u"Hall effect state", None))
        self.PlayerGo_button.setText(QCoreApplication.translate("MainWindow", u"PlayerGo", None))
        self.CNCcon_button.setText(QCoreApplication.translate("MainWindow", u"CNC connect", None))
    # retranslateUi

