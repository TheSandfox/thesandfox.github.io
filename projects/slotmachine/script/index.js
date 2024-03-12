let displays = [
	new SlotmachineDisplay('.slotmachine-display:first-child'), 
	new SlotmachineDisplay('.slotmachine-display:nth-child(2)'), 
	new SlotmachineDisplay('.slotmachine-display:nth-child(3)')
];

let slotmachine = new Slotmachine(displays);
displays[2].addItem("앤드류");
displays[2].addItem("스즈키");
displays[2].addItem("슐레이만");
displays[2].addItem("앗딘");
displays[2].addItem("블랑카");
displays[2].addItem("유리");
slotmachine.pull();