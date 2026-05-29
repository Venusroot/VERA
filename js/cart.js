// ==========================================
// SISTEMA DE CARRINHO POR USUÁRIO
// ==========================================

function getCarrinhoDoUsuario() {
  const usuario = getUsuarioLogado();
  if (!usuario) return [];
  return JSON.parse(localStorage.getItem(`usuario_${usuario.id}_carrinho`)) || [];
}

function salvarCarrinho(carrinho) {
  const usuario = getUsuarioLogado();
  if (!usuario) return;
  localStorage.setItem(`usuario_${usuario.id}_carrinho`, JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}

function adicionarAoCarrinho(produtoId, quantidade = 1, detalhes = {}) {
  const usuario = getUsuarioLogado();
  if (!usuario) {
    showToast('Faça login para adicionar ao carrinho');
    return false;
  }

  let carrinho = getCarrinhoDoUsuario();
  const existe = carrinho.find(item => item.id === produtoId);

  if (existe) {
    existe.quantidade += quantidade;
    Object.assign(existe, detalhes);
  } else {
    carrinho.push({ id: produtoId, quantidade, ...detalhes });
  }

  salvarCarrinho(carrinho);
  showToast('Produto adicionado ao carrinho!');
  renderCarrinho();
  return true;
}

function removerDoCarrinho(produtoId) {
  let carrinho = getCarrinhoDoUsuario();
  carrinho = carrinho.filter(item => item.id !== produtoId);
  salvarCarrinho(carrinho);
  showToast('Removido do carrinho');
  renderCarrinho();
}

function atualizarQuantidadeCarrinho(produtoId, quantidade) {
  let carrinho = getCarrinhoDoUsuario();
  const item = carrinho.find(i => i.id === produtoId);
  if (item) {
    item.quantidade = Math.max(1, quantidade);
    salvarCarrinho(carrinho);
    renderCarrinho();
  }
}

function atualizarContadorCarrinho() {
  const carrinho = getCarrinhoDoUsuario();
  const total = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  document.querySelectorAll('.cart-count').forEach(cartCount => {
    cartCount.textContent = total;
  });
}

function limparCarrinho() {
  const usuario = getUsuarioLogado();
  if (usuario) {
    localStorage.removeItem(`usuario_${usuario.id}_carrinho`);
    atualizarContadorCarrinho();
  }
}

function getProdutoId(card) {
  if (!card) return '';
  let id = card.dataset.id;
  if (!id) {
    id = String(Array.from(document.querySelectorAll('.product-card')).indexOf(card) + 1);
    card.dataset.id = id;
  }
  return id;
}

function obterDetalhesDoCard(card) {
  if (!card) return { titulo: 'Produto', descricao: '', preco: 'R$ 0', imagem: '' };
  const titulo = card.querySelector('h3')?.textContent?.trim() || 'Produto';
  const descricao = card.querySelector('.product-info p')?.textContent?.trim() || '';
  const preco = card.querySelector('.price')?.textContent?.trim() || 'R$ 0';
  const imagem = card.querySelector('.product-image img')?.src || '';
  return { titulo, descricao, preco, imagem };
}

function formatPrice(valor) {
  return Number(valor.replace(/[R$\.\s]/g, '').replace(',', '.')) || 0;
}

function renderCarrinho() {
  const container = document.querySelector('.cart-items');
  if (!container) return;

  const carrinho = getCarrinhoDoUsuario();
  if (carrinho.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>Seu carrinho está vazio. Adicione produtos para continuar.</p>
        <a href="produtos.html" class="btn-secondary">Continuar Comprando</a>
      </div>
    `;

    const summaryHeading = document.querySelector('.cart-summary h3');
    if (summaryHeading) summaryHeading.textContent = 'Total: R$ 0,00';
    const checkoutButton = document.querySelector('.checkout-link');
    if (checkoutButton) checkoutButton.classList.add('disabled');
    return;
  }

  const list = document.createElement('div');
  list.className = 'cart-items-list';
  let total = 0;

  carrinho.forEach(item => {
    const quantity = item.quantidade || 1;
    const priceNumber = formatPrice(item.preco || 'R$ 0');
    const subtotal = priceNumber * quantity;
    total += subtotal;

    const card = document.createElement('article');
    card.className = 'cart-item';
    card.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.imagem || 'assets/images/anel_01.jpg'}" alt="${item.titulo}">
      </div>
      <div class="cart-item-details">
        <h3>${item.titulo}</h3>
        <p>${item.descricao}</p>
        <span class="price">${item.preco}</span>
        <div class="cart-item-actions">
          <label>
            Quantidade
            <input type="number" min="1" value="${quantity}" data-id="${item.id}" />
          </label>
          <button class="remove-cart-btn" type="button" data-id="${item.id}">Remover</button>
        </div>
      </div>
    `;

    list.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(list);

  document.querySelectorAll('.remove-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
      removerDoCarrinho(button.dataset.id);
    });
  });

  document.querySelectorAll('.cart-item-actions input[type="number"]').forEach(input => {
    input.addEventListener('change', () => {
      atualizarQuantidadeCarrinho(input.dataset.id, Number(input.value));
    });
  });

  const summaryHeading = document.querySelector('.cart-summary h3');
  if (summaryHeading) {
    summaryHeading.textContent = `Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const checkoutButton = document.querySelector('.checkout-link');
  if (checkoutButton) {
    checkoutButton.classList.toggle('disabled', total === 0);
    checkoutButton.href = total === 0 ? '#' : 'checkout.html';
  }
}

function renderCheckoutResumo() {
  const checkoutSection = document.querySelector('.checkout-page');
  if (!checkoutSection) return;

  const carrinho = getCarrinhoDoUsuario();
  const checkoutItems = document.querySelector('.checkout-items');
  const checkoutTotal = document.querySelector('.checkout-total');
  const confirmButton = document.querySelector('.checkout-confirm');

  if (!checkoutItems || !checkoutTotal || !confirmButton) return;

  if (carrinho.length === 0) {
    checkoutItems.innerHTML = '<p>Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.</p>';
    checkoutTotal.textContent = 'Total: R$ 0,00';
    confirmButton.disabled = true;
    return;
  }

  let total = 0;
  checkoutItems.innerHTML = carrinho.map(item => {
    const priceNumber = formatPrice(item.preco || 'R$ 0');
    const subtotal = priceNumber * item.quantidade;
    total += subtotal;
    return `
      <div class="checkout-item">
        <img src="${item.imagem || 'assets/images/anel_01.jpg'}" alt="${item.titulo}" />
        <div>
          <strong>${item.titulo}</strong>
          <p>${item.descricao}</p>
          <span>${item.quantidade} x ${item.preco}</span>
        </div>
      </div>
    `;
  }).join('');

  checkoutTotal.textContent = `Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  confirmButton.disabled = false;
}

function initCartButtons() {
  document.querySelectorAll('.product-card').forEach(card => {
    let button = card.querySelector('.add-cart');
    const productBottom = card.querySelector('.product-bottom');
    if (!productBottom) return;

    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'add-cart';
      button.textContent = 'Adicionar ao carrinho';
      productBottom.appendChild(button);
    }

    button.addEventListener('click', () => {
      const produtoId = getProdutoId(card);
      const detalhes = obterDetalhesDoCard(card);
      adicionarAoCarrinho(produtoId, 1, detalhes);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarContadorCarrinho();
  renderCarrinho();
  initCartButtons();
  renderCheckoutResumo();
});