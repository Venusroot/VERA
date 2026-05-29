// ==========================================
// SCRIPT PRINCIPAL - AUTENTICAÇÃO E HEADER
// ==========================================

// Menu toggle mobile
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navbar?.classList.toggle('active');
  });
}

// Scroll effect no header
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

// Loader
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1800);
  }
  
  // Atualizar UI de autenticação
  atualizarUIAutenticacao();
  atualizarContadorCarrinho();
});

// Toast function
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('active');
  }, 100);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ==========================================
// GERENCIAMENTO DE AUTENTICAÇÃO NO HEADER
// ==========================================

function atualizarUIAutenticacao() {
  const usuario = getUsuarioLogado();
  const userIcon = document.querySelector('a[href="login.html"]');
  
  if (usuario && userIcon) {
    // Usuário está logado
    userIcon.innerHTML = `<i class="fa-solid fa-user"></i> <span style="margin-left: 5px; font-size: 0.85rem;">${usuario.nome}</span>`;
    userIcon.href = '#';
    userIcon.style.cursor = 'pointer';
    
    // Adicionar botão de logout
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'logout-btn';
    logoutBtn.innerHTML = '<i class="fa-solid fa-sign-out-alt"></i> Sair';
    logoutBtn.style.cssText = `
      background: transparent;
      border: none;
      color: inherit;
      cursor: pointer;
      font-size: 0.85rem;
      margin-left: 15px;
      transition: 0.3s;
    `;
    
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
      showToast('Você saiu da sua conta');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
    
    // Inserir botão de logout no header
    const headerActions = document.querySelector('.header-actions');
    if (headerActions && !headerActions.querySelector('.logout-btn')) {
      headerActions.insertBefore(logoutBtn, headerActions.lastChild);
    }
  }
}

// Carousel de slides no hero
const slides = document.querySelectorAll('.hero-slide');
if (slides.length > 0) {
  let currentSlide = 0;

  function changeSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  setInterval(changeSlide, 8000);
}