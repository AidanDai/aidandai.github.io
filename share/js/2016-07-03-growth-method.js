var count = 0;
function showCircles(e){
    switch(count){
    	case 0:
    		show('outer');
    		e.stop();
    		break;
    	case 1:
    		show('mid');
    		e.stop();
    		break;
    	case 2:
    		show('inner');
    		e.stop();
    		break;
    	default :
    		break;
    }
    count += 1; 
}

function show(className){
	var item = document.getElementsByClassName(className).item(0);
	item.style.visibility = 'visible';
	return 1;
}

function toggleStatu(statu){
	var	classNames = ['outer', 'mid', 'inner'];
	classNames.map(function(className){
		var item = document.getElementsByClassName(className).item(0);
		item.style.visibility = statu;
	});
}

function noVisible(){
    toggleStatu('hidden');
}
function visible(){
    toggleStatu('visible');
}