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
        ? 'Informe seu e-mail/login e sua senha.'
        : erro === 'fornecedor'
            ? 'Entre com uma conta de fornecedor para cadastrar produtos.'
            : 'E-mail/login ou senha inválidos para o tipo de conta selecionado.';
    feedback.classList.add('show');
}


function realizarLogin(email, senha) {

  const tipoPerfil = "vendedor"; // ou "cliente"

  const userData = {
    nome: "Nome do Usuário",
    email: email,
    tipo: tipoPerfil, // <-- Importante: 'vendedor' ou 'cliente'
    isLoggedIn: true
  };
  
  localStorage.setItem('userData', JSON.stringify(userData));

  // 3. Redirecione para a página principal
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const openModalBtn = document.getElementById('open-register-modal');
  const closeModalBtn = document.getElementById('close-register-modal');
  const registerModal = document.getElementById('register-modal');

  // Abrir o modal ao clicar em "Criar conta"
  if (openModalBtn && registerModal) {
    openModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      registerModal.hidden = false;
    });
  }

  // Fechar o modal ao clicar no botão "X"
  if (closeModalBtn && registerModal) {
    closeModalBtn.addEventListener('click', () => {
      registerModal.hidden = true;
    });
  }

  // Fechar o modal ao clicar na área externa escurecida
  if (registerModal) {
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) {
        registerModal.hidden = true;
      }
    });
  }
});