# CNC Controller

### GRBL based controller running on Atmega328p and using A4988 stepper drivers.

Even though the chess board only requires 2 axis of motion (corexy platform), board has been developped with full 3 axis features.

Coolant, spindle, ... are brought out as 12V low-side switches (0.5A/1A). This is used to activate the electromagnet for the head.
