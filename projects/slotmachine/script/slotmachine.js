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
	constructor(slotmachineInstance,defaultContent) {
		this.machine = slotmachineInstance;
		this.container = document.createElement('div');
		this.container.classList.add('slotmachine-display-wrapper');
		this.container.classList.add('dotbox');
		this.display = document.createElement('div');
		this.display.classList.add('slotmachine-display');
		this.slot_container = document.createElement('div');
		this.slot_container.classList.add('slot-container');
		this.slots = this.slot_container.children;
		this.hidden = false;
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
		// this.setSleep(true);
		this.sleep = true;
		//import
		if(defaultContent!==undefined){
			console.log("얍")
			this.importItems(defaultContent);
		}
		//push
		SlotmachineDisplay.THIS.push(this);
		SlotmachineDisplay.DISPLAYS.push(this.display);
	}
	timerAction() {
		if(this.sleep||this.hidden){return;}
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
		this.setRandomProgress();
	}
	clearItem() {
		while (this.slot_container.firstChild) {
			this.slot_container.removeChild(myNode.lastChild);
		}
	}
	importItems(stringArr) {
		stringArr.forEach((val)=>{
			this.addItem(val);
		});
	}
	clampProgress() {
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
	}
	getCurrentDisplayIndex() {
		let val = this.progress;
		if (this.slots.length<= 0){return 0;}
		if (val < 0) {
			while(val<0) {
				val += this.slots.length;
			}
		} else if (val >= this.slots.length) {
			while(val>=this.slots.length){
				val -= this.slots.length;
			}
		}
		return val;
	}
	carculatePosition() {
		this.clampProgress();
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
	//
	hide(flag) {
		this.hidden = flag;
		if (flag) {
			this.suspend();
			this.setRandomProgress();
			this.container.classList.add('hidden');
		} else {
			this.container.classList.remove('hidden');
			this.carculatePosition();
		}
	}
	//휴면
	setSleep(flag) {
		if(this.slots.length<=1){return;}
		this.sleep = flag;
		if(flag){
			this.clampProgress();
			this.machine.sleepRequest();
		} else {
			this.machine.awake();
		}
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
		if (this.slots.length<=1){return;}
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
		if(this.slots.length<=1){return;}
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
	static CURRENT_SELECTED_BUTTON = null;
	static LOCAL_ITEM_PREFIX = 'slotmachine-content';
	static get(buttonElement){
		return Slotmachine.THIS[buttonElement.dataset.index];
	}
	static releaseButton() {
		if (Slotmachine.CURRENT_SELECTED_BUTTON != null) {
			Slotmachine.CURRENT_SELECTED_BUTTON.classList.remove('pressed');
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
				// 눌린 버튼 종류에 따라 분기
				switch (Slotmachine.CURRENT_SELECTED_BUTTON.dataset.buttonName) {
					case 'pull' :
						//슬롯돌리기
						slotmachineInstance.setRandomProgress();
						slotmachineInstance.pull();
						break;
					case 'quick' :
						//즉시생성
						slotmachineInstance.setRandomProgress();
						slotmachineInstance.suspend();
						slotmachineInstance.awake();
						slotmachineInstance.sleepRequest();
						break;
					case 'plus' :
						//슬롯늘리기
						slotmachineInstance.setDisplayCount(slotmachineInstance.displayCount+1);
						break;
					case 'minus' :
						//슬롯줄이기
						slotmachineInstance.setDisplayCount(slotmachineInstance.displayCount-1);
						break;
					case 'copy' :
						let content = slotmachineInstance.resultDisplay.children[0].innerText;
						navigator.clipboard.writeText(content)
							.then(() => {
							// console.log("Text copied to clipboard...")
						})
							.catch(err => {
							// console.log('Something went wrong', err);
						})
						break;
					default :
				}
			}
		}
		Slotmachine.releaseButton()
	}
	static mouseDownCallback(event) {
		if(event.button!=0&&event.button!=2){return;}
		if(event.button==0) {
			event.preventDefault();
			Slotmachine.CURRENT_SELECTED_BUTTON = event.target;
			Slotmachine.CURRENT_SELECTED_BUTTON.classList.add('pressed');
		} else {
			Slotmachine.releaseButton();
		}
	}
	constructor(selector,name) {
		this.container = document.querySelector(selector);
		this.displays = [];
		this.buttons = [];
		this.index = Slotmachine.THIS.push(this) - 1;
		this.initTitle(name);
		this.initDisplayContainer();
		this.initButtons();
		this.initResultDisplay();
		this.displayCount = 0;
		return this;
	}
	addDisplay(defaultContent) {
		let display = new SlotmachineDisplay(this,defaultContent);
		this.display_container.appendChild(display.container);
		this.displays.push(display);
		this.displayCount += 1;
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
			if(!this.displays[i].hidden){
				this.displays[i].setRandomProgress();
			}
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
	initButtons() {
		let buttonContainer = document.createElement('div');
		buttonContainer.classList.add('slotmachine-button-container');
		for(let i = 0;i<4;i++){
			this.buttons[i] = document.createElement('div');
			this.buttons[i].classList.add('slotmachine-button');
			let dbox = document.createElement('div');
			dbox.classList.add('dotbox');
			this.buttons[i].appendChild(dbox);
			let plastic = document.createElement('div');
			plastic.classList.add('plastic');
			let top = document.createElement('div');
			top.classList.add('top');
			let bottom = document.createElement('div');
			bottom.classList.add('bottom');
			this.buttons[i].dataset.index=this.index;
			// append
			buttonContainer.appendChild(this.buttons[i]);
			this.buttons[i].appendChild(dbox);
			this.buttons[i].appendChild(plastic);
			plastic.appendChild(top);
			plastic.appendChild(bottom);
			// addevent
			this.buttons[i].addEventListener('mousedown',(event)=>{Slotmachine.mouseDownCallback(event);});
		}
		// indivisual content
		this.buttons[0].querySelector(' .top').innerHTML = 'GO!';
		this.buttons[1].querySelector(' .top').innerHTML = '⚡';
		this.buttons[2].querySelector(' .top').innerHTML = '+';
		this.buttons[3].querySelector(' .top').innerHTML = '-';
		this.buttons[1].classList.add('quick');
		this.buttons[2].classList.add('plus');
		this.buttons[3].classList.add('minus');
		this.buttons[0].dataset.buttonName='pull';
		this.buttons[1].dataset.buttonName='quick';
		this.buttons[2].dataset.buttonName='plus';
		this.buttons[3].dataset.buttonName='minus';
		// append
		this.container.appendChild(buttonContainer);
	}
	initResultDisplay() {
		this.resultDisplay = document.createElement('div');
		this.resultDisplay.classList.add('slotmachine-result-display');
		let resultText = document.createElement('div');
		resultText.classList.add('text');
		let copyButton = document.createElement('i');
		copyButton.className = "fi fi-bs-copy-alt copy";
		//append
		this.container.appendChild(this.resultDisplay);
		this.resultDisplay.appendChild(resultText);
		this.resultDisplay.appendChild(copyButton);
		//add event
		copyButton.dataset.index=this.index;
		copyButton.dataset.buttonName='copy';
		copyButton.addEventListener('mousedown',(event)=>{Slotmachine.mouseDownCallback(event);});
	}
	suspend() {
		for(let i = 0; i<this.displays.length; i++) {
			this.displays[i].suspend();
		}
	}
	sleepRequest() {
		let s = '';
		for(let i = 0; i<this.displays.length; i++) {
			if ((!this.displays[i].sleep)&&(!this.displays[i].hidden)){return;}
		}
		for(let i = 0; i<this.displays.length; i++) {
			if (this.displays[i].hidden||this.displays[i].slots.length<=0) {continue;}
			if (i==0) {
				s+= this.displays[i].slots[this.displays[i].getCurrentDisplayIndex()].innerHTML
			} else {
				s+=' '+this.displays[i].slots[this.displays[i].getCurrentDisplayIndex()].innerHTML;
			}
		}
		this.resultDisplay.children[0].innerText = s;
		this.resultDisplay.classList.add('active');
	}
	awake() {
		this.resultDisplay.classList.remove('active');
	}
	setDisplayCount(val) {
		let c = val;
		if(c<=0) {return;};
		if (c>this.displays.length) {
			for(let i=this.displays.length;i<c;i++) {
				this.addDisplay(["-"]);
			}
		}
		this.displayCount = c;
		for(let i = 0;i<this.displays.length;i++) {
			if (i<c) {
				this.displays[i].hide(false);
			} else {
				this.displays[i].hide(true);
			}
		}
		this.sleepRequest();
	}
	importItems(index,val) {
		if(index<0||index>=this.displays.length){return;}
		this.displays[index].importItems(val);
	}
}

// essencial configuration
window.addEventListener('mousemove',SlotmachineDisplay.moveCallback);
window.addEventListener('mouseup',SlotmachineDisplay.mouseUpCallback);
window.addEventListener('mouseup',(event)=>{Slotmachine.mouseUpCallback(event);});