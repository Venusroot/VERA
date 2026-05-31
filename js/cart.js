const cartMenuToggle = document.querySelector('.menu-toggle');
const cartNavbar = document.querySelector('.navbar');

cartMenuToggle?.addEventListener('click', () => {
  cartNavbar?.classList.toggle('active');
});

window.addEventListener('load', () => {

  setTimeout(() => {
    document.querySelector('.loader').style.display = 'none';
  }, 1500);

});

window.addEventListener('scroll', () => {

  const header = document.querySelector('.header');

  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

});

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