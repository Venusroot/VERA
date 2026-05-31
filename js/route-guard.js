/**
 * PROTEÇÃO DE ROTAS - VERA
 * Valida acesso a páginas protegidas e redireciona se necessário
 */

/**
 * Define quais páginas requerem autenticação
 * Páginas não listadas são públicas
 */
const PROTECTED_ROUTES = {
  'cart.html': { requireAuth: true, role: null },
  'checkout.html': { requireAuth: true, role: null },
  'favorites.html': { requireAuth: true, role: null },
  'admin.html': { requireAuth: true, role: 'admin' }
};

/**
 * Verifica se a página atual está protegida
 */
function getCurrentPage() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
}

/**
 * Valida acesso à página protegida
 * @returns {boolean} True se acesso permitido
 */
function validateAccess() {
  const currentPage = getCurrentPage();
  const route = PROTECTED_ROUTES[currentPage];

  // Se a página não está na lista de protegidas, acesso é público
  if (!route) {
    return true;
  }

  // Se requer autenticação
  if (route.requireAuth) {
    const user = getCurrentUser();

    // Não está autenticado - redireciona para login
    if (!user) {
      window.location.href = 'login.html';
      return false;
    }

    // Verifica permissão de role se necessário
    if (route.role && user.role !== route.role) {
      // Não tem permissão
      showToast('Você não tem permissão para acessar esta página');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
      return false;
    }
  }

  return true;
}

// ===== INICIALIZAÇÃO =====

// Valida acesso ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  validateAccess();
});
