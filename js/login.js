// ==========================================
// HANDLER DE LOGIN
// ==========================================

// MOSTRAR/OCULTAR SENHA
const togglePassword = document.querySelector('.toggle-password');
const password = document.querySelector('#password');

if (togglePassword && password) {
  togglePassword.addEventListener('click', () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
  });
}

// LOADER
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 2500);
  }
});

// FORMULÁRIO DE LOGIN
const loginForm = document.querySelector('.auth-form');
const emailInput = document.querySelector('input[type="email"]');
const senhaInput = document.querySelector('#password');
const loginBtn = document.querySelector('.login-btn');

if (loginForm && emailInput && senhaInput) {
  const errorMsg = document.createElement('div');
  errorMsg.className = 'form-error';
  errorMsg.style.color = '#d32f2f';
  errorMsg.style.marginBottom = '15px';
  errorMsg.style.fontSize = '0.85rem';
  loginForm.insertBefore(errorMsg, loginBtn);

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    
    if (!email || !senha) {
      errorMsg.textContent = 'Preencha todos os campos';
      return;
    }
    
    // Simular carregamento
    loginBtn.innerHTML = 'Entrando...';
    loginBtn.disabled = true;
    errorMsg.textContent = '';
    
    setTimeout(() => {
      const resultado = login(email, senha);
      
      if (resultado.sucesso) {
        showToast('Login realizado com sucesso!');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        errorMsg.textContent = resultado.mensagem;
        loginBtn.innerHTML = 'Entrar';
        loginBtn.disabled = false;
      }
    }, 1000);
  });
}