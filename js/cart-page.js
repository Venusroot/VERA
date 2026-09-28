/* VERA — lógica da página cart.html
   Lê o carrinho salvo no LocalStorage e renderiza em .cart-items.

   ATENÇÃO: confira em js/cart.js qual chave é usada no localStorage.
   Se não for uma das abaixo, adicione o nome em CART_KEYS. */

(function () {
  const CART_KEYS = ['cart', 'carrinho', 'vera_cart', 'veraCart'];
  const SHIPPING_KEY = 'vera_shipping'; // taxa escolhida (0.10 ou 0.15), útil para o checkout

  /* --- helpers --- */
  const $ = (s) => document.querySelector(s);
  const fmt = (v) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pick = (o, keys) => keys.find((k) => o[k] !== undefined && o[k] !== null);

  // aceita 1490, "1490", "R$ 1.490" ou "R$ 1.490,90"
  function parsePrice(v) {
    if (typeof v === 'number') return v;
    const n = String(v ?? '').replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(n) || 0;
  }

  /* --- acesso ao LocalStorage --- */
  let activeKey = CART_KEYS.find((k) => localStorage.getItem(k) !== null) || CART_KEYS[0];

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(activeKey) || '[]');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }
  function save(cart) {
    localStorage.setItem(activeKey, JSON.stringify(cart));
  }

  // lê os campos do item independentemente do nome usado no projeto
  function read(item) {
    const qtyKey = pick(item, ['quantity', 'qty', 'quantidade', 'qtd']) || 'quantity';
    return {
      qtyKey,
      name: item[pick(item, ['name', 'nome', 'title', 'titulo'])] || 'Produto',
      info: item[pick(item, ['info', 'description', 'descricao'])] || '',
      image: item[pick(item, ['image', 'img', 'imagem', 'foto'])] || '',
      price: parsePrice(item[pick(item, ['price', 'preco', 'valor'])]),
      qty: Math.max(1, parseInt(item[qtyKey], 10) || 1),
    };
  }

  /* --- contador do cabeçalho --- */
  function updateBadge(cart) {
    const total = cart.reduce((s, i) => s + read(i).qty, 0);
    document.querySelectorAll('.cart-count').forEach((el) => (el.textContent = total));
  }

  /* --- renderização --- */
  function render() {
    const cart = load();
    const wrap = $('.cart-items');

    wrap.innerHTML = cart.length
      ? cart.map((item, idx) => {
          const p = read(item);
          const img = p.image
            ? `<div class="cart-item-img has-img"><img src="${esc(p.image)}" alt="${esc(p.name)}"></div>`
            : `<div class="cart-item-img">[ imagem do produto aqui ]</div>`;
          return `
          <article class="cart-item">
            ${img}
            <div class="cart-item-info">
              <h4>${esc(p.name)}</h4>
              ${p.info ? `<p>${esc(p.info)}</p>` : ''}
              <div class="qty">
                <button type="button" data-act="dec" data-idx="${idx}" aria-label="Diminuir">−</button>
                <span>${p.qty}</span>
                <button type="button" data-act="inc" data-idx="${idx}" aria-label="Aumentar">+</button>
              </div>
            </div>
            <div class="cart-item-side">
              <div class="cart-item-price">${fmt(p.price * p.qty)}</div>
              <button type="button" class="remove-item" data-act="del" data-idx="${idx}">Remover</button>
            </div>
          </article>`;
        }).join('')
      : `<div class="cart-empty">Seu carrinho está vazio.<br><a href="produtos.html">Explorar produtos</a></div>`;

    const qty = cart.reduce((s, i) => s + read(i).qty, 0);
    const subtotal = cart.reduce((s, i) => { const p = read(i); return s + p.price * p.qty; }, 0);
    const rate = Number($('#shipping-type').value);
    const shipping = subtotal * rate;

    $('#summary-qty').textContent = qty;
    $('#summary-subtotal').textContent = fmt(subtotal);
    $('#summary-shipping').textContent = fmt(shipping);
    $('#summary-total').textContent = fmt(subtotal + shipping);
    $('#checkout-btn').classList.toggle('disabled', !cart.length);

    updateBadge(cart);
  }

  /* --- eventos --- */
  $('.cart-items').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const cart = load();
    const idx = Number(btn.dataset.idx);
    const item = cart[idx];
    if (!item) return;

    if (btn.dataset.act === 'del') {
      cart.splice(idx, 1);
    } else {
      const p = read(item);
      item[p.qtyKey] = Math.max(1, p.qty + (btn.dataset.act === 'inc' ? 1 : -1));
    }
    save(cart);
    render();
  });

  $('#shipping-type').addEventListener('change', () => {
    localStorage.setItem(SHIPPING_KEY, $('#shipping-type').value);
    render();
  });

  // restaura o tipo de envio escolhido anteriormente
  const savedRate = localStorage.getItem(SHIPPING_KEY);
  if (savedRate) $('#shipping-type').value = savedRate;
  else localStorage.setItem(SHIPPING_KEY, $('#shipping-type').value);

  // mantém a página sincronizada se o carrinho mudar em outra aba
  window.addEventListener('storage', render);

  render();
})();
