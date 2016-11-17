// function createColumn(element, columnWidth, tag){
// 	var width = Number.parseInt(element.clientWidth),
// 	 	columnCount = Math.floor(width / columnWidth) || 1,
// 		docfragment = document.createDocumentFragment(),
// 	    overplus = width - columnCount * columnWidth - 60,
// 	    minSeparation = 20 * (columnCount - 1);

// 	if(overplus < minSeparation || overplus < 0) {
// 		columnCount -= 1;
// 	}

// 	for(let i=0; i<columnCount; i+=1){
// 		let ele = document.createElement(tag);

// 		ele.setAttribute("style", "width: " + columnWidth + "px");
// 		ele.setAttribute("class", "column");
// 		docfragment.appendChild(ele);
// 	}
	
// 	element.innerHTML = "";
// 	element.appendChild(docfragment);
// }

// var ele = document.querySelector(".code-main"),
// 	re;

// window.onresize = window.onload = function(){
// 	clearTimeout(re);
// 	re = setTimeout(function(){
// 		createColumn(ele, 220, "li");
// 	}, 0)
// };

// /**
//  * [createElement description]
//  * @param  {[type]} tag      [description]
//  * @param  {[type]} codeData [description]
//  * @return {[type]}          [description]
//  */
// function createElement(tag, codeData) {
// 	var docfragment = document.createDocumentFragment(),
// 		ele = document.createElement(tag),
// 		img = document.createElement("img"),
// 		imgAttr,
// 		box = document.createElement("span"),
// 		boxAttr,
// 		title = document.createElement("a"),
// 		aAttr,
// 		des = document.createElement("p"),
// 		otherInfo = document.createElement("p"),
// 		span = document.createElement("span"),

// 		gitHubCardHTML = `<span>
// 			<a class="code-github-title" title="github">${codeData.title}</a>
// 			<p>${codeData.des}</p>
// 			<p>
// 				<span>${codeData.star}</span>
// 				<span><span class="code-main-language"></span>${codeData.language}</span>
// 			</p>
// 		</span>`;

// 	imgAttr = {
// 		"class": "code-prieve-img",
// 		"src": codeData.imgSrc,
// 		"art": codeData.imgArt,
// 		"title": codeData.imgTitle
// 	};
// 	boxAttr = {

// 	};
// 	languageAttr
	
// 	setAttr("img", codeData["img"]);
	
// }

// function appendElement(){

// }

// function setAttr(element, objAttr){
// 	var keys = Object.keys(objAttr);
// 	for(key in keys){
// 		element.setAttribute(key, objAttr[key]);
// 	}
// }