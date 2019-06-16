// var code = $('#code-main')
// $(window).resize(function(){
// 	code.outerHeight();
// 	code.attr('style', 'overflow: auto;')
// });
// $('document').ready(function(){
// 	var doc = $('#markdown-toc')
// 	var gt = $('.go-top')
// 	var gb = $('.go-bottom')

// 	$(doc).find('a').each(function(index, a){
// 		$(a).attr('target', '_self')
// 	})
// 	$(gt).on('click', function(){
// 		$(document).scrollTop(0)
// 	})
// 	$(gb).on('click', function(){
// 		$(document).scrollTop($(document).height())
// 	})
// })

window.addEventListener('DOMContentLoaded', function() {
	var allA = document.querySelectorAll('#markdown-toc a');
	var gt = document.querySelector('.go-top');
	var gb = document.querySelector('.go-bottom');

	if (allA) {
		allA.forEach(function (a) {
			a.setAttribute('target', '_self');
		});
	}

	if (gt) {
		gt.addEventListener('click', function () {
			document.documentElement.scrollTop = 0;
		});
	}
	
	if (gb) {
		gb.addEventListener('click', function () {
			document.documentElement.scrollTop = document.documentElement.scrollHeight;
		});
	}
});

if ('serviceWorker' in navigator) {
	// Use the window load event to keep the page load performant
	window.addEventListener('load', function serviceWorkerRegister(){
		navigator.serviceWorker.register('/asset/javascript/service-worker.js');
	});
}
