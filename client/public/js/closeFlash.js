const closeFlashBtn = document.querySelector('.close-flash');

const closeFlash = () => {
    const flashMsg = closeFlashBtn.parentElement;
    flashMsg.remove();
}

if(closeFlashBtn) {
    closeFlashBtn.addEventListener('click', closeFlash);
}