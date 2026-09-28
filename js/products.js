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

document.addEventListener('DOMContentLoaded', () => {
  checkUserSession();
});

function checkUserSession() {
  const storedUser = localStorage.getItem('userData');
  
  // Elemento do menu/dropdown do usuário (ajuste o seletor para a sua classe/ID)
  const userDropdownMenu = document.querySelector('.user-dropdown-menu'); 
  const userIcon = document.querySelector('.user-icon-toggle');

  if (!userDropdownMenu) return;

  if (storedUser) {
    const user = JSON.parse(storedUser);

    // 1. Opcional: Atualizar o ícone ou texto do botão principal com o nome do usuário
    if (userIcon) {
      userIcon.innerHTML = `Olá, <strong>${user.nome.split(' ')[0]}</strong>`;
    }

    // 2. Monta as opções do dropdown dinamicamente
    let dropdownContent = '';

    // Se for VENDEDOR, adiciona o botão "Vender"
    if (user.tipo === 'vendedor') {
      dropdownContent += `
        <a href="vender.html" class="dropdown-item btn-vender">
          <i class="fas fa-tag"></i> Vender
        </a>
        <hr class="dropdown-divider">
      `;
    }

    // Opção padrão de Sair
    dropdownContent += `
      <a href="#" id="logoutBtn" class="dropdown-item">
        <i class="fas fa-sign-out-alt"></i> Sair
      </a>
    `;

    // Renderiza o conteúdo dentro do menu dropdown
    userDropdownMenu.innerHTML = dropdownContent;

    // 3. Adiciona o evento de Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userData');
        window.location.reload();
      });
    }
  } else {
    // Caso NÃO esteja logado, exibe as opções de entrar/cadastrar
    userDropdownMenu.innerHTML = `
      <a href="login.html" class="dropdown-item">Entrar / Cadastrar</a>
    `;
  }
}