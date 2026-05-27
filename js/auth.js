const loginForm = document.querySelector('#loginForm');

if(loginForm){

  loginForm.addEventListener('submit', e => {

    e.preventDefault();

    const email = document.querySelector('#email').value;

    localStorage.setItem('user', JSON.stringify({
      email
    }));

    showToast('Login realizado com sucesso');

    setTimeout(() => {
      window.location.href = 'profile.html';
    },1500);

  });

}