let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.querySelectorAll('.favorite-btn').forEach(button => {

  button.addEventListener('click', () => {

    button.classList.toggle('active');

    showToast('Produto favoritado');

    localStorage.setItem('favorites', JSON.stringify(favorites));

  });

});