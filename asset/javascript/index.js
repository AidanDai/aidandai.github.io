// var code = $('#code-main')
// $(window).resize(function(){
// 	code.outerHeight();
// 	code.attr('style', 'overflow: auto;')
// });
$('document').ready(function(){
	var doc = $('#markdown-toc')
	var gt = $('.go-top')
	var gb = $('.go-bottom')
	var body = $('body')

	$(doc).find('a').each(function(index, a){
		$(a).attr('target', '_self')
	})
	$(gt).on('click', function(){
		$(document).scrollTop(0)
	})
	$(gb).on('click', function(){
		$(document).scrollTop($(document).height())
	})
})
