let SLOTMACHINE = new SlotMachine(document.body);

SLOTMACHINE.addDisplay(new SlotDisplay(96,96));
SLOTMACHINE.addDisplay(new SlotDisplay(96,96));
SLOTMACHINE.addDisplay(new SlotDisplay(96,96));

SLOTMACHINE.displays[0].addSlot(new Slot("가"));
SLOTMACHINE.displays[0].addSlot(new Slot("나"));
SLOTMACHINE.displays[0].addSlot(new Slot("다"));

SLOTMACHINE.displays[1].addSlot(new Slot("A"));
SLOTMACHINE.displays[1].addSlot(new Slot("B"));
SLOTMACHINE.displays[1].addSlot(new Slot("C"));

SLOTMACHINE.displays[2].addSlot(new Slot("1"));
SLOTMACHINE.displays[2].addSlot(new Slot("2"));
SLOTMACHINE.displays[2].addSlot(new Slot("3"));