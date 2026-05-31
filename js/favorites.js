document.addEventListener('DOMContentLoaded', () => {

  function getFavoritesKey() {
    const user = getCurrentUser();

    if (!user) return null;

    return `favorites_${user.email}`;
  }

  function getFavorites() {
    const key = getFavoritesKey();

    if (!key) return [];

    return JSON.parse(localStorage.getItem(key)) || [];
  }

  function saveFavorites(favorites) {
    const key = getFavoritesKey();

    if (!key) return;

    localStorage.setItem(key, JSON.stringify(favorites));
  }

  function isFavorited(id) {
    return getFavorites().some(item => item.id === id);
  }

  function updateButton(button, active) {
    if (active) {
      button.classList.add('active');
      button.innerHTML = '<i class="fa-solid fa-heart"></i>';
    } else {
      button.classList.remove('active');
      button.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }
  }

  // ===== FUNÇÕES GLOBAIS PARA FAVORITOS =====

  window.getUserFavorites = function () {
    return getFavorites();
  };

  window.removeFromFavorites = function (productId) {
    const favorites = getFavorites();

    const updated = favorites.filter(
      item => item.id !== productId
    );

    saveFavorites(updated);

    document.dispatchEvent(
      new CustomEvent('favoritesChanged')
    );

    return true;
  };

  window.onFavoritesChange = function (callback) {
    document.addEventListener(
      'favoritesChanged',
      callback
    );
  };

  // ===== BOTÕES DE FAVORITO =====

  document.querySelectorAll('.favorite-btn').forEach((button, index) => {

    const card = button.closest('.product-card');

    if (!card) return;

    const productId =
      card.dataset.productId ||
      `product-${index}`;

    card.dataset.productId = productId;

    updateButton(button, isFavorited(productId));

    button.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
      }

      const favorites = getFavorites();

      const existing = favorites.find(
        item => item.id === productId
      );

      if (existing) {

        const updated = favorites.filter(
          item => item.id !== productId
        );

        saveFavorites(updated);

        document.dispatchEvent(
          new CustomEvent('favoritesChanged')
        );

        updateButton(button, false);

        showToast('Removido dos favoritos');

      } else {

        const product = {
          id: productId,
          title: card.querySelector('h3')?.textContent || '',
          description: card.querySelector('p')?.textContent || '',
          price: card.querySelector('.price')?.textContent || '',
          image: card.querySelector('img')?.src || ''
        };

        favorites.push(product);

        saveFavorites(favorites);

        document.dispatchEvent(
          new CustomEvent('favoritesChanged')
        );

        updateButton(button, true);

        showToast('Adicionado aos favoritos');
      }
    });
  });
});