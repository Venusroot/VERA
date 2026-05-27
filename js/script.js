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