/**
 * USER MENU DROPDOWN - VERA
 * Gerencia o menu de usuário com logout
 */

document.addEventListener('DOMContentLoaded', () => {
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdown = document.getElementById('user-dropdown');
  const logoutBtn = document.getElementById('logout-btn');
  const userName = document.getElementById('user-name');

  if (!userMenuBtn || !userDropdown) return;

  /**
   * Atualiza o menu de usuário com base na autenticação
   */
  function updateUserMenu() {
    const user = getCurrentUser();

    if (user) {
      // Usuário autenticado
      userName.textContent = user.name.split(' ')[0]; // Primeiro nome
      userName.style.display = 'block';
      userMenuBtn.href = '#'; // Remove o link de login
    } else {
      // Usuário não autenticado
      userName.style.display = 'none';
      userMenuBtn.href = 'login.html';
    }
  }

  /**
   * Toggle do dropdown
   */
  userMenuBtn.addEventListener('click', (e) => {
    const user = getCurrentUser();

    // Se não autenticado, redireciona para login
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    e.stopPropagation();
    userDropdown.classList.toggle('active');
  });

  /**
   * Logout
   */
  logoutBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair da conta?')) {
      logout();
      showToast('Logout realizado com sucesso');
      userDropdown.classList.remove('active');
      
      // Redireciona para home após 1 segundo
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
  });

  /**
   * Fecha o dropdown ao clicar fora
   */
  document.addEventListener('click', (e) => {
    if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove('active');
    }
  });

  /**
   * Sincroniza o menu ao fazer login/logout em outra aba
   */
  window.addEventListener('storage', () => {
    updateUserMenu();
  });

  /**
   * Sincroniza ao carregar a página
   */
  updateUserMenu();
});
