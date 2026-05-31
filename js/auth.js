/**
 * SISTEMA DE AUTENTICAÇÃO - VERA
 * Gerencia login, logout, validação de usuário e sessão
 * Usa localStorage para persistência (sem backend)
 */

// ===== CONFIGURAÇÃO DE USUÁRIOS =====
const USERS_DATABASE = {
  'renan@fatec.com': {
    password: 'senha123',
    name: 'Renan',
    role: 'professor'
  },
  'humberto@fatec.com': {
    password: 'senha123',
    name: 'Humberto',
    role: 'professor'
  },
  'joao@fatec.com': {
    password: 'senha123',
    name: 'João',
    role: 'professor'
  },
  'admin@fatec.com': {
    password: 'admin123',
    name: 'Administrador',
    role: 'admin'
  }
};

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

/**
 * Valida credenciais do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {object|null} Dados do usuário ou null se inválido
 */
function validateUser(email, password) {
  const user = USERS_DATABASE[email];
  if (user && user.password === password) {
    return {
      email,
      name: user.name,
      role: user.role
    };
  }
  return null;
}

/**
 * Realiza login do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {boolean} True se login bem-sucedido
 */
function login(email, password) {
  const user = validateUser(email, password);
  
  if (user) {
    // Salva sessão no localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role,
      loginTime: new Date().toISOString()
    }));
    return true;
  }
  return false;
}

/**
 * Verifica se usuário está autenticado
 * @returns {object|null} Dados do usuário autenticado ou null
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Realiza logout do usuário
 */
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

/**
 * Verifica se usuário tem permissão de admin
 * @returns {boolean}
 */
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

/**
 * Verifica se usuário está autenticado
 * @returns {boolean}
 */
function isAuthenticated() {
  return getCurrentUser() !== null;
}

/**
 * Atualiza informações do usuário na navbar
 */
function updateUserInfo() {
  const user = getCurrentUser();
  
  if (user) {
    // Atualiza link de usuário para mostrar nome
    const userLink = document.querySelector('.header-actions .icon-link[href="login.html"]');
    if (userLink) {
      userLink.innerHTML = `<span style="font-size: 0.75rem; letter-spacing: 1px;">${user.name}</span>`;
      userLink.style.cursor = 'pointer';
      userLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
      userLink.title = 'Clique para sair';
    }
  }
}

// ===== MANIPULADOR DO FORMULÁRIO DE LOGIN =====

const loginForm = document.querySelector('#loginForm') || document.querySelector('.auth-form');

if(loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const emailInput = loginForm.querySelector('#email') || loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('#password') || loginForm.querySelector('input[type="password"]');
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validação básica
    if (!email || !password) {
      showToast('Por favor, preencha todos os campos');
      return;
    }

    // Tenta login
    if (login(email, password)) {
      showToast('Login realizado com sucesso!');
      
      // Aguarda um pouco antes de redirecionar
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      showToast('Email ou senha inválidos');
      passwordInput.value = '';
    }
  });
}

// ===== INICIALIZAÇÃO =====

// Atualiza informações do usuário ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  updateUserInfo();
});