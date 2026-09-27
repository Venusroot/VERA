const sessionLabel = document.querySelector('#user-session');
const supplierLink = document.querySelector('#fornecedor-link');
const loginLink = document.querySelector('.header-actions > .icon-link');
const logoutLink = document.querySelector('#logout-link');

fetch('sessao.php', { credentials: 'same-origin' })
    .then((response) => response.json())
    .then((session) => {
        if (!session.autenticado || !session.usuario) return;

        const { nome, tipo } = session.usuario;
        if (sessionLabel) {
            sessionLabel.textContent = `Olá, ${nome}`;
            sessionLabel.classList.add('user-session-visible');
        }

        if (logoutLink) {
            logoutLink.hidden = false;
        }

        if (tipo === 'fornecedor' && supplierLink) {
            supplierLink.hidden = false;
        }

        if (loginLink) {
            loginLink.setAttribute('aria-label', 'Conta de ' + nome);
            loginLink.title = `Conta de ${nome}`;
        }

        if (new URLSearchParams(window.location.search).get('login') === 'sucesso') {
            alert(`Usuário ${nome} logado com sucesso!`);
            window.history.replaceState({}, document.title, 'index.html');
        }

        return;
    })
    .then(() => {
        if (new URLSearchParams(window.location.search).get('logout') === 'sucesso') {
            alert('Você saiu da sua conta.');
            window.history.replaceState({}, document.title, 'index.html');
        }
    })
    .catch(() => {
        // A página continua navegável mesmo se a consulta da sessão falhar.
    });