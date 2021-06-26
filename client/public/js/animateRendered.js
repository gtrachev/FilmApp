const showcaseFilms = document.querySelectorAll('.showcase-film');
const detailsContentSections = document.querySelectorAll('.details-content-section');
const categoryHeaders = document.querySelectorAll('.category-header');
const carousels = document.querySelectorAll('.carousel');

const animateWhenRendered = (entries, animation) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting === true) {
        entry.target.classList.add(animation);
      }
    })
  }, { threshold: [0] });
  observer.observe(entries);
}

const addAnimationObserver = (elements, animation) => {
  if(elements && elements.length) {
    elements.forEach(el => {
      animateWhenRendered(el, animation)
    })
  }
}

addAnimationObserver(categoryHeaders, 'moveCategoryHeader');

addAnimationObserver(carousels, 'fadeIn');

addAnimationObserver(showcaseFilms, 'fadeIn');

addAnimationObserver(detailsContentSections, 'fadeIn');