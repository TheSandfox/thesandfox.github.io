window.addEventListener('contextmenu',(event)=>{event.preventDefault();});

let defaultItems = [
	[
		"심각한",
		"유쾌한",
		"경박한",
		"진지한",
		"신중한",
		"화려한",
		"신속한",
		"강력한",
		"냉혹한"
	],
	[
		"치유술사",
		"아이돌",
		"너구리",
		"엔지니어",
		"팝가수",
		"가설병",
		"알파카",
		"악어새",
		"연금술사",
		"연예인",
		"패셔니스타",
		"갯강구"
	],
	[
		"찰스",
		"앨빈",
		"데이브",
		"크리스",
		"앤드류",
		"스즈키",
		"슐레이만",
		"앗딘",
		"블랑카",
		"유고",
		"민수",
		"네이만"
	]
];

// localStorage.setItem(Slotmachine.LOCAL_ITEM_PREFIX+'0','aaa,bbb,ccc');

let slotmachine = new Slotmachine('.slotmachine.first','랜덤 작명기');
slotmachine.addDisplay();
slotmachine.addDisplay();
slotmachine.addDisplay();
for(let i=0;i<slotmachine.displays.length;i++){
	let localItem = localStorage.getItem(Slotmachine.LOCAL_ITEM_PREFIX+String(i));
	slotmachine.importItems(i,localItem?localItem.split(','):defaultItems[i]);
}
slotmachine.setRandomProgress();