// ==========================================
// SISTEMA DE FAVORITOS POR USUÁRIO
// ==========================================

function getFavoritosDoUsuario() {
  const usuario = getUsuarioLogado();
  if (!usuario) return [];
  return JSON.parse(localStorage.getItem(`usuario_${usuario.id}_favoritos`)) || [];
}

function saveFavoritosDoUsuario(favoritos) {
  const usuario = getUsuarioLogado();
  if (!usuario) return;
  localStorage.setItem(`usuario_${usuario.id}_favoritos`, JSON.stringify(favoritos));
}

function getFavoritosDetalhes() {
  const usuario = getUsuarioLogado();
  if (!usuario) return {};
  return JSON.parse(localStorage.getItem(`usuario_${usuario.id}_favoritos_detalhes`)) || {};
}

function saveFavoritosDetalhes(detalhes) {
  const usuario = getUsuarioLogado();
  if (!usuario) return;
  localStorage.setItem(`usuario_${usuario.id}_favoritos_detalhes`, JSON.stringify(detalhes));
}

function adicionarFavorito(produtoId, detalhes = null) {
  const usuario = getUsuarioLogado();
  if (!usuario) {
    showToast('Faça login para favoritar produtos');
    return false;
  }

  const favoritos = getFavoritosDoUsuario();
  if (!favoritos.includes(produtoId)) {
    favoritos.push(produtoId);
    saveFavoritosDoUsuario(favoritos);

    if (detalhes) {
      const todasDetalhes = getFavoritosDetalhes();
      todasDetalhes[produtoId] = detalhes;
      saveFavoritosDetalhes(todasDetalhes);
    }

    showToast('Produto adicionado aos favoritos');
    return true;
  }

  return false;
}

function removerFavorito(produtoId) {
  const usuario = getUsuarioLogado();
  if (!usuario) return false;

  let favoritos = getFavoritosDoUsuario();
  favoritos = favoritos.filter(id => id !== produtoId);
  saveFavoritosDoUsuario(favoritos);

  const todasDetalhes = getFavoritosDetalhes();
  delete todasDetalhes[produtoId];
  saveFavoritosDetalhes(todasDetalhes);

  showToast('Removido dos favoritos');
  return true;
}

function isFavoritado(produtoId) {
  return getFavoritosDoUsuario().includes(produtoId);
}

function toggleFavorito(produtoId, detalhes = null) {
  if (isFavoritado(produtoId)) {
    removerFavorito(produtoId);
    return false;
  }

  adicionarFavorito(produtoId, detalhes);
  return true;
}

function obterDetalhesDoCard(card) {
  if (!card) return null;
  const titulo = card.querySelector('h3')?.textContent?.trim() || 'Produto';
  const descricao = card.querySelector('.product-info p')?.textContent?.trim() || '';
  const preco = card.querySelector('.price')?.textContent?.trim() || '';
  const imagem = card.querySelector('.product-image img')?.src || '';

  return { titulo, descricao, preco, imagem };
}

function criarCartaoFavorito(item) {
  const card = document.createElement('div');
  card.className = 'favorite-item';

  card.innerHTML = `
    <img src="${item.imagem || 'assets/images/anel_01.jpg'}" alt="${item.titulo}">
    <div class="favorite-info">
      <h3>${item.titulo}</h3>
      <p>${item.descricao}</p>
      <div class="favorite-price">${item.preco}</div>
      <div class="favorite-actions">
        <button class="remove" type="button" data-id="${item.id}">Remover</button>
      </div>
    </div>
  `;

  return card;
}

function renderFavoritos() {
  const content = document.getElementById('favorites-content');
  if (!content) return;

  const usuario = getUsuarioLogado();
  if (!usuario) {
    content.innerHTML = `
      <div class="favorites-empty">
        <i class="fa-regular fa-heart"></i>
        <p>Faça login para ver seus favoritos.</p>
      </div>
    `;
    return;
  }

  const favoritos = getFavoritosDoUsuario();
  const detalhes = getFavoritosDetalhes();

  if (favoritos.length === 0) {
    content.innerHTML = `
      <div class="favorites-empty">
        <i class="fa-regular fa-heart"></i>
        <p>Você ainda não possui produtos favoritos.</p>
      </div>
    `;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'favorites-grid';

  favoritos.forEach(id => {
    const itemDetalhe = detalhes[id] || { id, titulo: `Produto ${id}`, descricao: 'Descrição não disponível.', preco: '', imagem: 'assets/images/anel_01.jpg' };
    grid.appendChild(criarCartaoFavorito({ id, ...itemDetalhe }));
  });

  content.innerHTML = '';
  content.appendChild(grid);

  content.querySelectorAll('.favorite-actions button.remove').forEach(button => {
    button.addEventListener('click', () => {
      const produtoId = button.dataset.id;
      if (!produtoId) return;

      removerFavorito(produtoId);
      renderFavoritos();
    });
  });
}

function atualizarEstadoFavoritoDoBotao(button, produtoId) {
  const icon = button.querySelector('i');
  if (!icon) return;

  if (isFavoritado(produtoId)) {
    icon.classList.remove('fa-regular');
    icon.classList.add('fa-solid');
  } else {
    icon.classList.remove('fa-solid');
    icon.classList.add('fa-regular');
  }
}

function inicializarFavoritos() {
  document.querySelectorAll('.favorite-btn').forEach(button => {
    const productCard = button.closest('.product-card');
    let produtoId = productCard?.dataset.id;
    if (!produtoId) {
      produtoId = String(Array.from(document.querySelectorAll('.product-card')).indexOf(productCard));
    }

    atualizarEstadoFavoritoDoBotao(button, produtoId);

    button.addEventListener('click', (e) => {
      e.preventDefault();

      const usuario = getUsuarioLogado();
      if (!usuario) {
        showToast('Faça login para favoritar produtos');
        return;
      }

      const detalhes = obterDetalhesDoCard(productCard);
      const isFav = toggleFavorito(produtoId, detalhes);
      atualizarEstadoFavoritoDoBotao(button, produtoId);

      if (!isFav && document.getElementById('favorites-content')) {
        renderFavoritos();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarFavoritos();
  renderFavoritos();
});