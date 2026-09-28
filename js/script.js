const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

menuToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');
});

window.addEventListener('load', () => {

  const loader = document.querySelector('.loader');

  setTimeout(() => {

    loader.classList.add('hidden');

  }, 1800);

});

window.addEventListener('scroll', () => {

  const header = document.querySelector('.header');

  if(window.scrollY > 50){
    header.classList.add('scrolled');
  }else{
    header.classList.remove('scrolled');
  }

});

function showToast(message){

  const toast = document.createElement('div');

  toast.className = 'toast';
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('active');
  },100);

  setTimeout(() => {
    toast.remove();
  },3000);

}

const slides =
document.querySelectorAll('.hero-slide');

let currentSlide = 0;

function changeSlide(){

    slides[currentSlide]
    .classList.remove('active');

    currentSlide++;

    if(currentSlide >= slides.length){

        currentSlide = 0;

    }

    slides[currentSlide]
    .classList.add('active');

}

setInterval(changeSlide, 8000);

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderSession();
  updateCartBadge();
});

// 1. Gerencia a exibição do menu de usuário / vendedor
function updateHeaderSession() {
  const storedUser = localStorage.getItem('userData');
  const accountMenu = document.getElementById('account-menu');
  const loginLink = document.getElementById('login-link');
  const accountName = document.getElementById('account-name');
  const supplierLinks = document.querySelectorAll('[data-account-link="supplier"]');
  const logoutBtn = document.getElementById('logout-btn');

  if (storedUser) {
    const user = JSON.parse(storedUser);

    // Exibe o menu da conta e esconde o botão simples de login
    if (accountMenu) accountMenu.hidden = false;
    if (loginLink) loginLink.style.display = 'none';

    // Preenche o nome do usuário
    if (accountName) {
      accountName.textContent = user.nome ? user.nome.split(' ')[0] : 'Usuário';
    }

    // Se for VENDEDOR (ou supplier), exibe as opções de venda
    if (user.tipo === 'vendedor' || user.tipo === 'supplier') {
      supplierLinks.forEach(link => link.hidden = false);
    } else {
      supplierLinks.forEach(link => link.hidden = true);
    }

    // Configura a ação de logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userData');
        window.location.reload();
      });
    }
  } else {
    // Caso não esteja logado
    if (accountMenu) accountMenu.hidden = true;
    if (loginLink) loginLink.style.display = 'inline-flex';
  }
}

// 2. Atualiza a contagem do carrinho na sacola
function updateCartBadge() {
  const cartCountEl = document.querySelector('.cart-count');
  if (!cartCountEl) return;

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  cartCountEl.textContent = totalQty;
}