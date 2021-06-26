const bgTrack = document.querySelector('.bg-track');
const bgSlides = document.querySelectorAll('.bg-slide');

const bgSlideWidth = bgSlides[0].getBoundingClientRect().width;

bgSlides.forEach((slide, index) => {
    slide.style.right = `-${bgSlideWidth*index}px`;
})

const bgMoveSlide = (amountToMove, currentSlide, targetSlide) => {
    bgTrack.style.transform = `translateX(${amountToMove})`
    currentSlide.classList.remove('bg-currentSlide')
    targetSlide.classList.add('bg-currentSlide')
}

const bgCheckRight = () => {
    if(bgSlides[bgSlides.length - 1].classList.contains('bg-currentSlide')) {
        return true;
    }
    return false;
}

const bgMove = () => {
    if(!bgCheckRight()) {
        const currentSlide = bgTrack.querySelector('.bg-currentSlide');
        const targetSlide = currentSlide.nextElementSibling;
        const amountToMove = targetSlide.style.right;
        
        bgMoveSlide(amountToMove, currentSlide, targetSlide);
    } else {
        bgSlides.forEach((slide, index) => {
            bgTrack.style.transform = `translateX(${bgSlideWidth*index}px)`
            slide.classList.remove('bg-currentSlide');
        })
        bgSlides[0].classList.add('bg-currentSlide');
    }
}

setInterval(bgMove, 5000);