// ==========================================
// SISTEMA DE AUTENTICAÇÃO CENTRALIZADO
// ==========================================

/**
 * Faz login do usuário validando email e senha
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {object} { sucesso: boolean, mensagem: string }
 */
function login(email, senha) {
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);
  
  if (usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    return { sucesso: true, mensagem: 'Login realizado com sucesso!' };
  }
  
  return { sucesso: false, mensagem: 'Email ou senha incorretos' };
}

/**
 * Faz logout do usuário
 */
function logout() {
  localStorage.removeItem('usuarioLogado');
}

/**
 * Retorna o usuário atualmente logado
 * @returns {object|null} Objeto do usuário ou null
 */
function getUsuarioLogado() {
  const user = localStorage.getItem('usuarioLogado');
  return user ? JSON.parse(user) : null;
}

/**
 * Verifica se há um usuário logado
 * @returns {boolean}
 */
function isLogado() {
  return getUsuarioLogado() !== null;
}

/**
 * Protege rotas - redireciona para login se não autenticado
 */
function protegerRota() {
  if (!isLogado()) {
    window.location.href = 'login.html';
  }
}