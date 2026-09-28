const accountMenu = document.querySelector('#account-menu');
const sessionLabel = document.querySelector('#user-session');
const accountName = document.querySelector('#account-name');
const accountGreeting = document.querySelector('.account-greeting');
const supplierLinks = document.querySelectorAll('[data-account-link="supplier"]');
const supplierName = document.querySelector('[data-supplier-name]');
const loginLink = document.querySelector('#login-link');
const requiresSupplier = document.body.hasAttribute('data-require-supplier');

fetch('sessao.php', { credentials: 'same-origin' })
    .then((response) => response.json())
    .then((session) => {
        if (!session.autenticado || !session.usuario) {
            if (requiresSupplier) {
                window.location.replace('login.html?erro=fornecedor');
            }
            return;
        }

        const { nome, tipo } = session.usuario;
        if (tipo === 'fornecedor' && supplierName) {
            supplierName.textContent = nome;
        }

        if (requiresSupplier && tipo !== 'fornecedor') {
            window.location.replace('index.html?erro=permissao');
            return;
        }

        if (accountName && accountGreeting && accountMenu && sessionLabel) {
            accountName.textContent = nome;
            accountGreeting.textContent = tipo === 'fornecedor' ? 'FORNECEDOR' : 'CLIENTE';
            sessionLabel.setAttribute('aria-label', `Conta de ${tipo === 'fornecedor' ? 'fornecedor' : 'cliente'} ${nome}`);
            accountMenu.hidden = false;
        }

        if (tipo === 'fornecedor') {
            supplierLinks.forEach((link) => {
                link.hidden = false;
            });
        }

        if (loginLink) {
            loginLink.hidden = true;
        }

        if (new URLSearchParams(window.location.search).get('login') === 'sucesso') {
            alert(`${tipo === 'fornecedor' ? 'Fornecedor' : 'Usuário'} ${nome} logado com sucesso!`);
            window.history.replaceState({}, document.title, 'index.html');
        }

        return;
    })
    .then(() => {
        const parametros = new URLSearchParams(window.location.search);
        if (parametros.get('logout') === 'sucesso') {
            alert('Você saiu da sua conta.');
            window.history.replaceState({}, document.title, 'index.html');
        } else if (parametros.get('erro') === 'fornecedor') {
            alert('Entre com uma conta de fornecedor para cadastrar produtos.');
            window.history.replaceState({}, document.title, 'login.html');
        } else if (parametros.get('erro') === 'permissao') {
            alert('Esta área é exclusiva para fornecedores.');
            window.history.replaceState({}, document.title, 'index.html');
        }
    })
    .catch(() => {
        // A página continua navegável mesmo se a consulta da sessão falhar.
    });