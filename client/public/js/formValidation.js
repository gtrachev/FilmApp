const form = document.querySelector('#account-form');
const username = form.querySelector('#username');
const email = form.querySelector('#email');
const password = form.querySelector('#password');

const validateInput = (input, validator) => {
    if(validator) {
        input.classList.remove('not-validated');
        input.classList.add('validated');
        input.nextElementSibling.classList.add('d-none');
        return 0;
    }
    input.classList.remove('validated');
    input.classList.add('not-validated');
    input.nextElementSibling.classList.remove('d-none');
    return 1;
}

const emailValidate = (email) => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.value);
}

const usernameValidate = (username) => {
    return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(username.value);
}

const validateForm = (e) => {
    let error = 0;
    
    error += validateInput(username, username.value && username.value.length && username.value.length <= 20 && !usernameValidate(username) ? true : false);
    
    if(email) {
        error += validateInput(email, email.value && email.value.length && emailValidate(email) ? true : false);
    }

    error += validateInput(password, password.value && password.value.length >= 4 ? true : false);

    if(error) {
        e.preventDefault();
    }
}

form.addEventListener('submit', validateForm);