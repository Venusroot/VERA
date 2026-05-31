document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  // sincroniza automaticamente quando carrinho muda
  onCartChange(() => {
    renderCart();
  });
});

function renderCart() {
  const container = document.querySelector('.cart-items');
  const totalEl = document.querySelector('.cart-summary h3');

  if (!container || !totalEl) return;

  const cart = getUserCart();

  // carrinho vazio
  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>Seu carrinho está vazio</h2>
        <p>Explore nossos produtos e adicione itens à sacola.</p>
      </div>
    `;

    totalEl.textContent = 'Total: R$ 0,00';
    return;
  }

  let html = '';

  cart.forEach(item => {
    html += `
      <div class="cart-item">
        
        <img src="${item.image}" alt="${item.title}">

        <div class="cart-info">
          <h3>${item.title}</h3>
          <p>${item.category || ''}</p>
          <span>${item.priceFormatted}</span>
        </div>

        <div class="cart-actions">

          <button onclick="updateQty('${item.id}', -1)">-</button>

          <span>${item.quantity}</span>

          <button onclick="updateQty('${item.id}', 1)">+</button>

          <button class="remove-btn" onclick="removeItem('${item.id}')">
            Remover
          </button>

        </div>

      </div>
    `;
  });

  container.innerHTML = html;

  totalEl.textContent = `Total: ${getCartTotalFormatted()}`;
}

function updateQty(id, change) {
  const item = getCartItem(id);
  if (!item) return;

  updateCartItemQuantity(id, item.quantity + change);
}

function removeItem(id) {
  removeFromCart(id);
}