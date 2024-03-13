class SlotmachineDisplay {
	static TIMER_TICK = 0.025;
	static THIS = [];
	static DISPLAYS = [];
	static CURRENT_SELECTED = null;
	static get(htmlelement) {
		return SlotmachineDisplay.THIS[SlotmachineDisplay.DISPLAYS.indexOf(htmlelement)];
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
		SlotmachineDisplay.CURRENT_SELECTED = slotInstance;
		slotInstance.setSleep(false);
		slotInstance.suspend();
	}
	// window에서 호출, 현재 선택중인 슬롯을 move
	static moveCallback(event) {
		if(SlotmachineDisplay.CURRENT_SELECTED == null){return;}
		let slotInstance = SlotmachineDisplay.CURRENT_SELECTED;
		slotInstance.moveWithGwansung(-(event.movementY)/slotInstance.getHeight());
	}
	// window에서 호출, 버튼 뗐을 때 현재 선택중인 슬롯을 비움
	static mouseUpCallback() {
		SlotmachineDisplay.CURRENT_SELECTED = null;
	}
	constructor() {
		this.container = document.createElement('div');
		this.container.classList.add('dotbox');
		this.display = document.createElement('div');
		this.display.classList.add('slotmachine-display');
		this.slot_container = document.createElement('div');
		this.slot_container.classList.add('slot-container');
		this.slots = this.slot_container.children;
		//append
		this.container.appendChild(this.display);
		this.display.appendChild(this.slot_container);
		//property
		this.progress = 0.0;
		this.autoProgress = 0.0;
		this.gwansung = 0.0;
		this.yVector = [0.0,0.0,0.0,0.0,0.0];
		this.carculatePosition();
		this.display.addEventListener('mousedown',SlotmachineDisplay.mouseDownCallback);
		this.machal = 1.75;
		this.timer = setInterval(()=>{
			this.timerAction();
		},25);
		this.setSleep(true);
		//push
		SlotmachineDisplay.THIS.push(this);
		SlotmachineDisplay.DISPLAYS.push(this.display);
	}
	timerAction() {
		if(this.sleep){return;}
		if(this==SlotmachineDisplay.CURRENT_SELECTED) {
			this.progress += (this.autoProgress)*SlotmachineDisplay.TIMER_TICK;
		} else {
			this.progress += (this.autoProgress-this.gwansung)*SlotmachineDisplay.TIMER_TICK;
			this.gwansung -= this.machal*SlotmachineDisplay.TIMER_TICK*Math.sign(this.gwansung);
			if (Math.abs(this.gwansung)<=this.machal*SlotmachineDisplay.TIMER_TICK){this.gwansung = 0;}
			if (this.gwansung == 0) {
				if((this.progress+1)-Math.floor(this.progress+1)>SlotmachineDisplay.TIMER_TICK) {
					this.progress -= -0.8 * SlotmachineDisplay.TIMER_TICK;
					if((this.progress+1)-Math.floor(this.progress+1)<=SlotmachineDisplay.TIMER_TICK) {
						this.progress = Math.floor(this.progress+1) - 1;
					}
				} else {
					this.progress = Math.floor(this.progress+1) - 1;
					this.setSleep(true);
				}	
			}
		}
		this.carculatePosition();
	}
	suspend() {
		this.yVector.fill(0.0);
		this.gwansung = 0.;
	}
	destroy() {
		this.display.removeEventListener('mousedown',SlotmachineDisplay.mouseDownCallback);
		SlotmachineDisplay.DISPLAYS.splice(SlotmachineDisplay.DISPLAYS.indexOf(this.display),1);
		SlotmachineDisplay.THIS.splice(SlotmachineDisplay.THIS.indexOf(this),1);
	}
	getWidth() {
		return this.display.offsetWidth;
	}
	getHeight() {
		return this.display.offsetHeight;
	}
	addItem(val,classes) {
		let newSlot = document.createElement('div');
		newSlot.innerHTML = val;
		newSlot.classList.add('slot');
		if (classes!=undefined) {
			classes.forEach((val)=>{
				newSlot.classList.add(val);
			})
		}
		this.slot_container.appendChild(newSlot);
	}
	clearItem() {
		while (this.slot_container.firstChild) {
			this.slot_container.removeChild(myNode.lastChild);
		}
	}
	importItem(stringArr) {
		stringArr.forEach((val)=>{
			this.addItem(val);
		});
	}
	carculatePosition() {
		//프로그레스 클램핑
		if (this.slots.length<=1){return;}
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
	//휴면
	setSleep(flag) {
		this.sleep = flag;
	}
	// 무작위 슬롯으로
	setRandomProgress() {
		this.progress = Math.floor(Math.random() * this.slots.length);
		this.carculatePosition();
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
		let rval = Math.random();
		let yval = (this.slots.length*0.5)+6+rval*2
		this.machal = 1.5+rval*2;
		this.yVector.fill(yval);
		this.gwansung = yval;
		this.setSleep(false);
	}
}

class Slotmachine {
	static THIS = [];
	static BUTTONS = [];
	static CURRENT_SELECTED_BUTTON = null;
	static get(buttonElement){ 
		return Slotmachine.THIS[Slotmachine.BUTTONS.indexOf(buttonElement)];
	}
	static releaseButton() {
		if (Slotmachine.CURRENT_SELECTED_BUTTON != null) {
			let bottom = Slotmachine.CURRENT_SELECTED_BUTTON.querySelector(' .bottom');
			bottom.classList.remove('hidden');
			Slotmachine.CURRENT_SELECTED_BUTTON = null;
			return true;
		} else {
			return false;
		}
	}
	static mouseUpCallback(event) {
		if(event.button!=0){return;}
		// 눌린 버튼이 있으면
		if(Slotmachine.CURRENT_SELECTED_BUTTON != null){
			if (event.button==0&&event.target==Slotmachine.CURRENT_SELECTED_BUTTON) {
				let slotmachineInstance = Slotmachine.get(Slotmachine.CURRENT_SELECTED_BUTTON);
				slotmachineInstance.setRandomProgress();
				slotmachineInstance.pull();
			}
		}
		Slotmachine.releaseButton()
	}
	static mouseDownCallback(event) {
		if(event.button!=0&&event.button!=2){return;}
		if(event.button==0) {
			Slotmachine.CURRENT_SELECTED_BUTTON = event.target;
			let bottom = Slotmachine.CURRENT_SELECTED_BUTTON.querySelector(' .bottom');
			bottom.classList.add('hidden');
		} else {
			Slotmachine.releaseButton();
		}
	}
	constructor(selector,name) {
		this.container = document.querySelector(selector);
		this.displays = [];
		this.button = null;
		this.initTitle(name);
		this.initDisplayContainer();
		this.initButton();
		Slotmachine.THIS.push(this);
		Slotmachine.BUTTONS.push(this.button);
	}
	addDisplay() {
		let display = new SlotmachineDisplay();
		this.display_container.appendChild(display.container);
		this.displays.push(display);
	}
	addDisplayItem(ind,val) {
		this.displays[ind].addItem(val);
	}
	pull() {
		for(let i = 0;i<this.displays.length;i++) {
			this.displays[i].pull();
		}
	}
	setRandomProgress() {
		for(let i = 0;i<this.displays.length;i++) {
			this.displays[i].setRandomProgress();
		}
	}
	initTitle(name) {
		this.title = document.createElement('h1');
		this.title.innerHTML = name;
		this.container.appendChild(this.title);
	}
	setTitle(val) {
		this.title.innerHTML = val;
	}
	initDisplayContainer() {
		this.display_container = document.createElement('div');
		this.display_container.classList.add('slotmachine-display-container');
		this.container.appendChild(this.display_container);
	}
	initButton() {
		this.button = document.createElement('div');
		this.button.classList.add('slotmachine-button');
		let dbox = document.createElement('div');
		dbox.classList.add('dotbox');
		this.button.appendChild(dbox);
		let plastic = document.createElement('div');
		plastic.classList.add('plastic');
		let top = document.createElement('div');
		top.classList.add('top');
		let bottom = document.createElement('div');
		bottom.classList.add('bottom');
		top.innerHTML = 'GO!';
		// append
		this.container.appendChild(this.button);
		this.button.appendChild(dbox);
		this.button.appendChild(plastic);
		plastic.appendChild(top);
		plastic.appendChild(bottom);
		// addevent
		this.button.addEventListener('mousedown',(event)=>{Slotmachine.mouseDownCallback(event);});
	}
}

window.addEventListener('mousemove',SlotmachineDisplay.moveCallback);
window.addEventListener('mouseup',SlotmachineDisplay.mouseUpCallback);
window.addEventListener('mouseup',(event)=>{Slotmachine.mouseUpCallback(event);});