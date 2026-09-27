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

const form = document.querySelector('.auth-form');
const button = document.querySelector('.login-btn');

if (form && button) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        button.querySelector('span').textContent = 'Entrando...';
        button.disabled = true;
        button.style.opacity = '.7';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                credentials: 'same-origin',
                redirect: 'follow'
            });

            window.location.assign(response.url);
        } catch (error) {
            button.querySelector('span').textContent = 'Entrar';
            button.disabled = false;
            button.style.opacity = '1';
            if (feedback) {
                feedback.textContent = 'Não foi possível conectar ao servidor.';
                feedback.classList.add('show');
            }
        }
    });
}

const feedback = document.querySelector('#login-feedback');
const parametros = new URLSearchParams(window.location.search);
const erro = parametros.get('erro');
const cadastro = parametros.get('cadastro');

if (feedback && cadastro === 'sucesso') {
    feedback.textContent = 'Conta criada com sucesso. Entre com seus dados.';
    feedback.classList.add('show');
}

if (feedback && erro) {
    feedback.textContent = erro === 'preencha'
        ? 'Informe seu e-mail e sua senha.'
        : 'E-mail ou senha inválidos.';
    feedback.classList.add('show');
}