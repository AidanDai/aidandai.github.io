function homeBackgroundImage(){
	var home = document.querySelector(".home-contain");

	home.style.backgroundImage = `linear-gradient(to right, ${randomColor()} 0%, ${randomColor()} 100%)`;
}

module.exports = homeBackgroundImage;