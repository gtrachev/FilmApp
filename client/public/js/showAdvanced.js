const advancedBtn = document.querySelector('#advancedBtn');
const discoverContainer = document.querySelector('.discover-search-container');

const showAdvanced = (e) => {
    discoverContainer.classList.toggle('showAdvanced');
}

advancedBtn.addEventListener('click', showAdvanced);