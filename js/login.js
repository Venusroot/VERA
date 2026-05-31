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

// BOTÃO LOADING E LOGIN

const form =
document.querySelector('.auth-form');

const button =
document.querySelector('.login-btn');

const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

form.addEventListener('submit', (e) => {

    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Inicia loading
    button.innerHTML = 'Entrando...';
    button.style.opacity = '.7';
    button.disabled = true;

    // Tenta fazer login
    setTimeout(() => {
        const loginSuccess = login(email, password);

        if (loginSuccess) {
            // Login bem-sucedido
            showToast('Login realizado com sucesso! 🎉');
            
            // Aguarda um pouco para o usuário ver a mensagem
            setTimeout(() => {
                // Redireciona para index
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Login falhou
            button.innerHTML = 'Entrar';
            button.style.opacity = '1';
            button.disabled = false;
            showToast('Email ou senha incorretos');
        }
    }, 1500);

});