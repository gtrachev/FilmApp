const tracks = document.querySelectorAll('.track');
const slides = document.querySelectorAll('.slide');
const next = document.querySelectorAll('.next');
const previous = document.querySelectorAll('.previous');

const slideWidth = slides[0].getBoundingClientRect().width;

const checkLeft = (track) => {
    const slides = track.querySelectorAll('.slide');
    if(slides[0].classList.contains('currentSlide')) 
        track.parentElement.previousElementSibling.style.display = 'none';
}

const checkRight = (track) => {
    const slides = track.querySelectorAll('.slide');
    const next = track.parentElement.nextElementSibling;
    if(window.innerWidth > '900') {
        if(slides[slides.length - 5].classList.contains('currentSlide'))
        next.style.display = 'none';
    } else if(window.innerWidth <= '900' && window.innerWidth > '700') {
        if(slides[slides.length - 4].classList.contains('currentSlide'))
        next.style.display = 'none';
    } else if(window.innerWidth <= '700' && window.innerWidth > '500') {
        if(slides[slides.length - 3].classList.contains('currentSlide'))
        next.style.display = 'none';
    } else if(window.innerWidth <= '500') {
        if(slides[slides.length - 2].classList.contains('currentSlide'))
        next.style.display = 'none';
    }
}

tracks.forEach(track => {
    const slides = track.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.style.left = `${slideWidth*index}px`;
    })
    checkLeft(track);
    checkRight(track);
})

const moveSlide = (amountToMove, currentSlide, targetSlide, track) => {
    track.style.transform = `translateX(-${amountToMove})`
    currentSlide.classList.remove('currentSlide')
    targetSlide.classList.add('currentSlide')
}

const moveNextSlide = (e) => {
    const track = e.target.previousElementSibling.firstElementChild;
    const currentSlide = track.querySelector('.currentSlide');
    const targetSlide = currentSlide.nextElementSibling;
    const amountToMove = targetSlide.style.left;

    moveSlide(amountToMove, currentSlide, targetSlide, track);

    e.target.previousElementSibling.previousElementSibling.style.display = 'block';

    checkRight(track);
}

const movePreviousSLide = (e) => {
    const track = e.target.nextElementSibling.firstElementChild;
    const currentSlide = track.querySelector('.currentSlide');
    const targetSlide = currentSlide.previousElementSibling;
    const amountToMove = targetSlide.style.left;

    moveSlide(amountToMove, currentSlide, targetSlide, track);

    e.target.nextElementSibling.nextElementSibling.style.display = 'block';

    checkLeft(track);
}

next.forEach(btn => {
    btn.addEventListener('click', moveNextSlide);
})
previous.forEach(btn => {
    btn.addEventListener('click', movePreviousSLide);
})