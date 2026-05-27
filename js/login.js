// LOADER

window.addEventListener('load', () => {

    const loader = document.querySelector('.loader');

    setTimeout(() => {

        loader.classList.add('hide');

    }, 2500);

});

// MOSTRAR SENHA

const togglePassword =
document.querySelector('.toggle-password');

const password =
document.querySelector('#password');

togglePassword.addEventListener('click', () => {

    const type =
    password.getAttribute('type') === 'password'
    ? 'text'
    : 'password';

    password.setAttribute('type', type);

    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');

});

// BOTÃO LOADING

const form =
document.querySelector('.auth-form');

const button =
document.querySelector('.login-btn');

form.addEventListener('submit', (e) => {

    e.preventDefault();

    button.innerHTML = 'Entrando...';

    button.style.opacity = '.7';

    setTimeout(() => {

        button.innerHTML = 'Entrar';
        button.style.opacity = '1';

    }, 2500);

});