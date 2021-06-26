const bgCarousel = document.querySelector('.bg-carousel-container');

const checkIfPassed = (e) => {
    if (window.scrollY > (bgCarousel.offsetTop + bgCarousel.offsetHeight)) {
        document.querySelector('#nav').classList.add('showNavBg');
    } else if(document.querySelector('#nav').classList.contains('showNavBg')){
        document.querySelector('#nav').classList.remove('showNavBg');
    }
}

window.addEventListener('scroll', checkIfPassed);