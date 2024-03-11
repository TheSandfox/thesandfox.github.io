class Slot {
	constructor(content) {
		this.container = document.createElement('div');
		this.container.classList.add('slot');
		this.container.innerHTML = content;
	}
}

class SlotDisplay {
	constructor(width, height, parent) {
		this.slots = [];
		this.mask = document.createElement('div');
		this.container = document.createElement('div');
		this.width = width;
		this.height = height;
		//
		this.mask.classList.add('slotMask');
		this.mask.appendChild(this.container);
		this.mask.style.height = (this.height+"px");
		this.container.classList.add('slotContainer');
		//
		if(parent!=undefined) {this.appendTo(parent);}
	}
	removeSlot(slot) {
		this.container.removeChild(slot);
		this.slots.splice(this.slots.indexOf(slot),1);
		slot.remove();
	}
	addSlot(slot) {
		this.container.appendChild(slot.container);
		slot.container.style.width = this.width;
		slot.container.style.height = this.height;
		this.slots.push(slot);
	}
	appendTo(parent) {
		parent.appendChild(this.mask);
	}
	scroll(val) {
		let approx = this.container.scrollHeight+val;
		if(approx>(this.height*(this.slots.length+1))) {
			while(approx>this.height*(this.slots.length+1)) {
				let m = this.height*this.slots.length;
				if(m==0.0) {break;}
				approx -= m;
			}
		} else if(approx<0) {
			while(approx<0) {
				let m = this.height*this.slots.length;
				if(m==0.0) {break;}
				approx += m;
			}
		}
		this.container.scrollTo(0,approx);
	}
}

class SlotMachine {
	constructor(parent) {
		this.container = document.createElement('div');
		this.container.classList.add('slotMachine');
		parent.appendChild(this.container);
		this.displays = [];
	}
	addDisplay(display) {
		display.appendTo(this.container);
		this.displays.push(display);
	}
}