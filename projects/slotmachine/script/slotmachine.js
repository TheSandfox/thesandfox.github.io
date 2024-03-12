class SlotmachineDisplay {
	static THISTYPE = [];
	static MASKS = [];
	static CURRENT_SELECTED_SLOTMACHINE_DISPLAY = null;
	static get(htmlelement) {
		return SlotmachineDisplay.THISTYPE[SlotmachineDisplay.MASKS.indexOf(htmlelement)];
	}
	// instance에서 호출, 선택한 슬롯을 현재 선택중인 슬롯에 할당
	static mouseDownCallback(event) {
		if(event.button==2){
			let slotInstance = SlotmachineDisplay.get(this);
			slotInstance.pull();
			return;
		} else if (event.button!=0) {
			return;
		}
		let slotInstance = SlotmachineDisplay.get(this);
		SlotmachineDisplay.CURRENT_SELECTED_SLOTMACHINE_DISPLAY = slotInstance;
		slotInstance.yVector.fill(0.0);
		slotInstance.gwansung = 0.;
	}
	// window에서 호출, 현재 선택중인 슬롯을 move
	static moveCallback(event) {
		if(SlotmachineDisplay.CURRENT_SELECTED_SLOTMACHINE_DISPLAY == null){return;}
		let slotInstance = SlotmachineDisplay.CURRENT_SELECTED_SLOTMACHINE_DISPLAY;
		slotInstance.moveWithGwansung(-(event.movementY)/slotInstance.getHeight());
	}
	// window에서 호출, 버튼 뗐을 때 현재 선택중인 슬롯을 비움
	static mouseUpCallback() {
		SlotmachineDisplay.CURRENT_SELECTED_SLOTMACHINE_DISPLAY = null;
	}
	constructor(selector) {
		this.mask = document.querySelector(selector);
		this.container = document.querySelector(selector+'>.slot-container');
		this.slots = this.container.children;
		this.progress = 0.0;
		this.autoProgress = 0.0;
		this.gwansung = 0.0;
		this.yVector = [0.0,0.0,0.0,0.0,0.0];
		this.carculatePosition();
		this.mask.addEventListener('mousedown',SlotmachineDisplay.mouseDownCallback);
		this.mask.addEventListener('contextmenu',(event)=>{event.preventDefault();});
		this.machal = 1.75;
		this.timer = setInterval(()=>{
			if(this==SlotmachineDisplay.CURRENT_SELECTED_SLOTMACHINE_DISPLAY) {
				this.progress += (this.autoProgress)*0.025;
			} else {
				this.progress += (this.autoProgress-this.gwansung)*0.025;
				this.gwansung -= this.machal*0.025*Math.sign(this.gwansung);
				if (Math.abs(this.gwansung)<=this.machal*0.025){this.gwansung = 0;}
				if (this.gwansung == 0) {
					if((this.progress+1)-Math.floor(this.progress+1)>0.025) {
						this.progress -= -0.8 * 0.025;
						if((this.progress+1)-Math.floor(this.progress+1)<=0.025) {
							this.progress = Math.floor(this.progress+1) - 1;
						}
					} else {
						this.progress = Math.floor(this.progress+1) - 1;
					}	
				}
			}
			this.carculatePosition();
		},25);
		this.settle = false;
		SlotmachineDisplay.THISTYPE.push(this);
		SlotmachineDisplay.MASKS.push(this.mask);
	}
	destroy() {
		this.mask.removeEventListener('mousedown',SlotmachineDisplay.mouseDownCallback);
		SlotmachineDisplay.MASKS.splice(SlotmachineDisplay.MASKS.indexOf(this.mask),1);
		SlotmachineDisplay.THISTYPE.splice(SlotmachineDisplay.THISTYPE.indexOf(this),1);
	}
	getWidth() {
		return this.mask.offsetWidth;
	}
	getHeight() {
		return this.mask.offsetHeight;
	}
	addItem(val) {
		let newSlot = document.createElement('div');
		newSlot.innerHTML = val;
		newSlot.classList.add('slot');
		this.container.appendChild(newSlot);
	}
	clearItem() {
		while (this.container.firstChild) {
			this.container.removeChild(myNode.lastChild);
		}
	}
	importItem(stringArr) {
		stringArr.forEach((val)=>{
			this.addItem(val);
		});
	}
	carculatePosition() {
		//프로그레스 클램핑
		if (this.progress<=-1.0) {
			while (this.progress<=-1.0) {
				this.progress += this.slots.length;
			}
		} else if (this.progress>=this.slots.length-1) {
			while (this.progress>=this.slots.length-1) {
				this.progress -= this.slots.length;
			}
		}
		for(let i = 0;i<this.slots.length;i++) {
			//프로그레스 음수일 때 마지막 요소 위로
			if (i==this.slots.length-1 && this.progress < 0.) {
				this.slots[i].style.top = (-this.progress+i-this.slots.length) * this.getHeight() +'px';
			}
			//프로그레스 오버일 때 첫번째 요소 마지막으로
			else if (i==0 && this.progress > this.slots.length) {
				this.slots[i].style.top = (-this.progress+i+this.slots.length) * this.getHeight() +'px';
			}
			else {
				this.slots[i].style.top = (-this.progress+i) * this.getHeight() +'px';
				
			}
		}
	}
	// 순수 이동만
	move(val) {
		this.progress += val;
		this.carculatePosition();
	}
	// 양수방향일 때 위로 올라감
	moveWithGwansung(val) {
		this.yVector.shift();
		this.yVector.push(val);
		this.gwansung = (this.yVector.reduce((a, b) => a + b, 0)*-10 / this.yVector.length);
		if(this.gwansung >= 10.0) {
			this.gwansung = 10.0;
		}
		this.move(val);
	}
	//굴리기
	pull() {
		let yval = (this.slots.length*0.5)+6+Math.random()*2
		this.yVector.fill(yval);
		this.gwansung = yval;
	}
}

class Slotmachine {
	constructor(displays) {
		this.displays = [];
		displays.forEach((display)=>{
			this.displays.push(display);
		})
	}
	addDisplay(display) {
		this.displays.push(display);
	}
	pull() {
		for(let i = 0;i<this.displays.length;i++) {
			this.displays[i].pull();
		}
	}
}

window.addEventListener('mousemove',SlotmachineDisplay.moveCallback);
window.addEventListener('mouseup',SlotmachineDisplay.mouseUpCallback);