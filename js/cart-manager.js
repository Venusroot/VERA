/**
 * GERENCIADOR DE CARRINHO - VERA
 * Centraliza toda a lógica de carrinho com autenticação
 * Integrado com auth.js para controlar acesso
 */

/**
 * Obtém a chave de armazenamento de carrinho do usuário atual
 * @returns {string|null} Chave de localStorage ou null se não autenticado
 */
function getCartStorageKey() {
  const user = getCurrentUser();
  return user ? `userCart_${user.email}` : null;
}

/**
 * Obtém todos os itens do carrinho do usuário atual
 * @returns {array} Array de itens do carrinho
 */
function getUserCart() {
  const key = getCartStorageKey();
  if (!key) return [];
  
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    console.error('Erro ao carregar carrinho:', e);
    return [];
  }
}

/**
 * Salva carrinho no localStorage
 * @param {array} cart - Array de itens do carrinho
 */
function saveCart(cart) {
  const key = getCartStorageKey();
  if (!key) return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(cart));
    updateCartCount();
    dispatchCartChangeEvent();
    return true;
  } catch (e) {
    console.error('Erro ao salvar carrinho:', e);
    return false;
  }
}

/**
 * Verifica se um produto está no carrinho
 * @param {string} productId - ID do produto
 * @returns {boolean}
 */
function isInCart(productId) {
  const cart = getUserCart();
  return cart.some(item => item.id === productId);
}

/**
 * Obtém um item do carrinho
 * @param {string} productId - ID do produto
 * @returns {object|null}
 */
function getCartItem(productId) {
  const cart = getUserCart();
  return cart.find(item => item.id === productId) || null;
}

/**
 * Adiciona um produto ao carrinho
 * @param {string} productId - ID do produto
 * @param {number} quantity - Quantidade (padrão: 1)
 * @returns {boolean} True se adicionado com sucesso
 */
function addToCart(productId, quantity = 1) {
  // Valida autenticação
  if (!isAuthenticated()) {
    showToast('Faça login para adicionar ao carrinho');
    return false;
  }

  // Obtém dados do produto
  const product = getProductById(productId);
  if (!product) {
    showToast('Produto não encontrado');
    return false;
  }

  // Obtém carrinho atual
  const cart = getUserCart();

  // Verifica se já está no carrinho
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    // Aumenta quantidade
    existingItem.quantity += quantity;
  } else {
    // Cria novo item
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      priceFormatted: product.priceFormatted,
      image: product.images[0],
      category: product.category,
      quantity: quantity,
      addedAt: new Date().toISOString()
    };
    cart.push(cartItem);
  }

  // Salva
  if (saveCart(cart)) {
    showToast(`${product.title} adicionado ao carrinho!`);
    return true;
  }

  return false;
}

/**
 * Remove um produto do carrinho
 * @param {string} productId - ID do produto
 * @returns {boolean} True se removido com sucesso
 */
function removeFromCart(productId) {
  if (!isAuthenticated()) {
    return false;
  }

  const cart = getUserCart();
  const filtered = cart.filter(item => item.id !== productId);

  if (filtered.length === cart.length) {
    // Produto não estava no carrinho
    return false;
  }

  if (saveCart(filtered)) {
    showToast('Removido do carrinho');
    return true;
  }

  return false;
}

/**
 * Atualiza quantidade de um item no carrinho
 * @param {string} productId - ID do produto
 * @param {number} newQuantity - Nova quantidade
 * @returns {boolean}
 */
function updateCartItemQuantity(productId, newQuantity) {
  if (!isAuthenticated()) {
    return false;
  }

  const cart = getUserCart();
  const item = cart.find(item => item.id === productId);

  if (!item) {
    return false;
  }

  if (newQuantity <= 0) {
    return removeFromCart(productId);
  }

  item.quantity = newQuantity;
  return saveCart(cart);
}

/**
 * Limpa o carrinho
 */
function clearCart() {
  const key = getCartStorageKey();
  if (key) {
    localStorage.removeItem(key);
    updateCartCount();
    dispatchCartChangeEvent();
  }
}

/**
 * Obtém o total de itens no carrinho
 * @returns {number}
 */
function getCartCount() {
  const cart = getUserCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Calcula o total em reais
 * @returns {number}
 */
function getCartTotal() {
  const cart = getUserCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Obtém total formatado em reais
 * @returns {string}
 */
function getCartTotalFormatted() {
  const total = getCartTotal();
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(total);
}

/**
 * Atualiza o contador do carrinho na navbar
 */
function updateCartCount() {
  const count = getCartCount();
  const cartCountElement = document.querySelector('.cart-count');
  
  if (cartCountElement) {
    if (count > 0) {
      cartCountElement.textContent = count;
      cartCountElement.style.display = 'flex';
    } else {
      cartCountElement.style.display = 'none';
    }
  }
}

/**
 * Dispara evento customizado para sincronização entre abas
 */
function dispatchCartChangeEvent() {
  const event = new CustomEvent('cartChanged', {
    detail: {
      cart: getUserCart(),
      count: getCartCount(),
      total: getCartTotal(),
      totalFormatted: getCartTotalFormatted(),
      timestamp: new Date().toISOString()
    }
  });
  document.dispatchEvent(event);
}

/**
 * Listener para mudanças de carrinho
 * Use em páginas que mostram o carrinho
 */
function onCartChange(callback) {
  document.addEventListener('cartChanged', (event) => {
    callback(event.detail);
  });
}

/**
 * Limpa o carrinho ao fazer logout
 */
function setupLogoutCartCleanup() {
  const originalLogout = window.logout;
  window.logout = function() {
    clearCart();
    if (originalLogout) originalLogout();
  };
}

// ===== INICIALIZAÇÃO =====

document.addEventListener('DOMContentLoaded', () => {
  // Atualiza contador do carrinho ao carregar
  updateCartCount();

  // Sincroniza carrinho quando muda
  onCartChange((data) => {
    updateCartCount();
  });

  // Setup logout cleanup
  setupLogoutCartCleanup();
});
