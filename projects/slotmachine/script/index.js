window.addEventListener('contextmenu',(event)=>{event.preventDefault();});

// localStorage.setItem(Slotmachine.LOCAL_ITEM_PREFIX_CONTENT+'0','aaa,bbb,ccc');

let slotmachine = new Slotmachine('.slotmachine.first','다용도 룰렛');
// for(let i=0;i<slotmachine.displays.length;i++){
// 	let localItem = localStorage.getItem(Slotmachine.LOCAL_ITEM_PREFIX_CONTENT+String(i));
// 	slotmachine.importItems(i,localItem?localItem.split(','):defaultItems[i]);
// }
slotmachine.setRandomProgress();