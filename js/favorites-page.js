/**
 * PÁGINA DE FAVORITOS - VERA
 * Compatível com auth.js sem favorites-manager.js
 */

document.addEventListener('DOMContentLoaded', () => {

  const favoritesContent = document.getElementById('favorites-content');

  function getFavorites() {
    const user = getCurrentUser();

    if (!user) return [];

    return JSON.parse(
      localStorage.getItem(`favorites_${user.email}`)
    ) || [];
  }

  function saveFavorites(favorites) {
    const user = getCurrentUser();

    if (!user) return;

    localStorage.setItem(
      `favorites_${user.email}`,
      JSON.stringify(favorites)
    );
  }

  function removeFavorite(productId) {
    const favorites = getFavorites();

    const updated = favorites.filter(
      item => item.id !== productId
    );

    saveFavorites(updated);

    renderFavorites();
  }

  function renderFavorites() {

    const user = getCurrentUser();

    if (!user) {
      favoritesContent.innerHTML = `
        <div class="empty-favorites">
          <i class="fa-regular fa-user"></i>
          <h2>Faça login para visualizar seus favoritos</h2>
          <a href="login.html" class="continue-shopping">
            Fazer Login
          </a>
        </div>
      `;
      return;
    }

    const favorites = getFavorites();

    if (favorites.length === 0) {
      favoritesContent.innerHTML = `
        <div class="empty-favorites">
          <i class="fa-regular fa-heart"></i>
          <h2>Você ainda não possui produtos favoritos</h2>
          <p>Explore nossa coleção e adicione seus produtos preferidos aos favoritos</p>
          <a href="produtos.html" class="continue-shopping">
            Continuar Compras
          </a>
        </div>
      `;
      return;
    }

    let html = `
      <div class="favorites-header">
        <h1>Meus Favoritos</h1>
        <p>${favorites.length} produto${favorites.length !== 1 ? 's' : ''} salvos</p>
      </div>

      <div class="favorites-grid">
    `;

    favorites.forEach(favorite => {

      html += `
        <div class="favorite-card" data-product-id="${favorite.id}">
          
          <div class="favorite-image">
            <img src="${favorite.image}" alt="${favorite.title}">

            <button
              class="favorite-remove"
              data-product-id="${favorite.id}"
              type="button">

              <i class="fa-solid fa-heart"></i>
            </button>
          </div>

          <div class="favorite-info">

            <h3>${favorite.title}</h3>

            <p>${favorite.description || ''}</p>

            <div class="favorite-bottom">

              <span class="favorite-price">
                ${favorite.price}
              </span>

              <button
                class="add-to-cart-btn"
                data-product-id="${favorite.id}"
                type="button">

                Adicionar ao Carrinho
              </button>

            </div>

          </div>

        </div>
      `;
    });

    html += `</div>`;

    favoritesContent.innerHTML = html;

    setupListeners();
  }

  function setupListeners() {

    document.querySelectorAll('.favorite-remove')
      .forEach(button => {

        button.addEventListener('click', e => {

          e.preventDefault();

          const productId =
            button.dataset.productId;

          removeFavorite(productId);
        });
      });

    document.querySelectorAll('.add-to-cart-btn')
      .forEach(button => {

        button.addEventListener('click', () => {

          showToast(
            'Integração com carrinho será feita após alinharmos os IDs dos produtos'
          );
        });
      });
  }

  renderFavorites();
});