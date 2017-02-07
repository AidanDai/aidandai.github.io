var code = $("#code-main");
var lis = $("#code-main li");

var li = 200;
var width = code.outerWidth();
var left = 0;
var top = 0;

$.each(lis, function(li){
	$(li).css({"left": left + "px", "top": top + "px"});
	// top += $(li).outerHeight();
});

$(window).resize(function(){});

