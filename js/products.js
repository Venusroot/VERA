const searchInput = document.querySelector('.search-box input');

searchInput.addEventListener('keyup', e => {

  const value = e.target.value.toLowerCase();

  document.querySelectorAll('.product-card').forEach(card => {

    const title = card.querySelector('h3').innerText.toLowerCase();

    if(title.includes(value)){
      card.style.display = 'block';
    }else{
      card.style.display = 'none';
    }

  });

});