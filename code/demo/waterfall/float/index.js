const count = 20;
const total = 161;
const initRow = 10;

var DATA = {
	index: 0,
	img: []
};

function imgPath(index){
	return "../image/" + "p_" + String(index).replace(/\d+/g, function(m){
		return "0".repeat(3 - m.length) + m + ".jpg";
	});
}

function img(index, count){
	var last = index + count,
		isHave,
		data = {
			isHave: true,
			img: []
		};

	if(last > total){
		last = total;
		data.isHave = false;
	}

	for(var i=index; i<last; i+=1){
		data.img.push(imgPath(i));
	}
	
	DATA.index = last;
	DATA.img = DATA.img.concat(data.img);

	return data;
}

function paintInfo(){
	var columns = $(".column:visible"); // 缓存
	var col = columns.length;

	var imgs = [];
	var row = (function(columns, col){ // 最大行
		var max = 0;
		for(var i=0; i<col; i+=1){
			var img = $(columns[i]).find("img");
			var r = img.length;

			imgs.push(img); // 按列装载图片
			if(r > max){
				max = r;
			}
		}
		return max;
	})(columns, col);

	return {
		row: row,
		col: col,
		imgs: imgs
	};
}

function ladyLoading(){
	
	var info = paintInfo();
	var data;

	DATA.index = info.col * initRow;
	data = img(0, DATA.index);

	paintImg(info.imgs, DATA.img, info.row, info.col);
}

function paintImg(imgs, data, row, col){
	var temp = data.slice();
	for(var i=0; i<row; i+=1){
		for(var j=0; j<col; j+=1){
			if(imgs[j][i]){
				$(imgs[j][i]).attr("src", temp.shift());
			}
		}
	}
}

function onresize(){
	var info = paintInfo();

	paintImg(info.imgs, DATA.img, info.row, info.col);
}

function tip(message){
	var load = $(".loading");

	switch(message){
		case "get":
			break;
		default :
			load.text("君上，没有了...");
	}

	load.show();

	setTimeout(function(){
		load.hide();
	}, 2000);
}

function appendImg(data){
	var imgs = data.img;
	var len1 = data.img.length;
	var columns = [].slice.call($(".column:visible"));
	var len2 = columns.length;
	var n = Math.floor(len1 / len2);

	for(let i=0; i<n; i+=1){
		for(let j=0; j<len2; j+=1){
			var url = imgs.shift();
			if(url){
				var item = $('<a class="loading-temp"></a>'); // 不要写在循环外面，那样会被jQuery缓存
				var img = new Image();

				img.src = url;
				$(item).append(img);

				$(columns[j]).append(item);
			}
			
		}

	}
}

$(document).ready(function(){
	ladyLoading();

	var t;
	$(window).resize(function(){// 函数节流
		$(window).scrollTop(0);
		
		clearTimeout(t);
		t = setTimeout(onresize(), 0);
	});

	$(window).scroll(function(){
		if($(document).scrollTop() + $(window).height() === $(document).height()){
			var data = img(DATA.index, count);
			if(data.isHave){
				tip("get");
				appendImg(data);
			}else{
				tip();
			}
		}
	});
});