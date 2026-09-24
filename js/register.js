// ===== LOADER =====

window.addEventListener('load', () => {

    const loader = document.querySelector('.loader');

    setTimeout(() => {

        loader.classList.add('hide');

    }, 2500);

});

// ===== MOSTRAR / OCULTAR SENHA =====

document.querySelectorAll('.toggle-password').forEach((toggle) => {

    const input = document.querySelector(toggle.dataset.target);

    if (!input) return;

    toggle.addEventListener('click', () => {

        const type =
            input.getAttribute('type') === 'password'
                ? 'text'
                : 'password';

        input.setAttribute('type', type);

        toggle.classList.toggle('fa-eye');
        toggle.classList.toggle('fa-eye-slash');

    });

});

// ===== MÁSCARAS =====

const onlyDigits = (v) => v.replace(/\D/g, '');

const masks = {

    cpf(value) {
        return onlyDigits(value)
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    },

    cnpj(value) {
        return onlyDigits(value)
            .slice(0, 14)
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    },

    cep(value) {
        return onlyDigits(value)
            .slice(0, 8)
            .replace(/(\d{5})(\d{1,3})/, '$1-$2');
    },

    phone(value) {
        const digits = onlyDigits(value).slice(0, 11);

        if (digits.length <= 10) {
            return digits
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        }

        return digits
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    }

};

document.querySelectorAll('[data-mask]').forEach((input) => {

    const applyMask = () => {

        const fn = masks[input.dataset.mask];

        if (fn) input.value = fn(input.value);

    };

    input.addEventListener('input', applyMask);
    input.addEventListener('blur', applyMask);

});

// ===== BUSCA DE CEP (ViaCEP) =====

const cepInput = document.querySelector('#cep');

if (cepInput) {

    cepInput.addEventListener('blur', async () => {

        const cep = onlyDigits(cepInput.value);

        if (cep.length !== 8) return;

        cepInput.style.opacity = '.6';

        try {

            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) return;

            document.querySelector('#logradouro').value = data.logradouro || '';
            document.querySelector('#bairro').value = data.bairro || '';
            document.querySelector('#cidade').value = data.localidade || '';
            document.querySelector('#uf').value = data.uf || '';

        } catch (error) {

            console.warn('Não foi possível buscar o CEP.', error);

        } finally {

            cepInput.style.opacity = '1';

        }

    });

}

// ===== ESTRANGEIRO =====

const estrangeiro = document.querySelector('#estrangeiro');

if (estrangeiro) {

    const camposEstrangeiro = [
        document.querySelector('#nacionalidade'),
        document.querySelector('#documento')
    ];

    const camposLocalizacao = [
        cepInput,
        document.querySelector('#logradouro'),
        document.querySelector('#numero'),
        document.querySelector('#bairro'),
        document.querySelector('#cidade'),
        document.querySelector('#uf')
    ];

    estrangeiro.addEventListener('change', () => {

        const ativo = estrangeiro.checked;

        camposEstrangeiro.forEach((campo) => {
            campo.disabled = !ativo;
            if (!ativo) campo.value = '';
        });

        camposLocalizacao.forEach((campo) => {
            campo.disabled = ativo;
            if (ativo) campo.value = '';
        });

    });

}

// ===== VALIDAÇÃO + BOTÃO LOADING =====

const form = document.querySelector('#register-form');
const button = document.querySelector('.register-btn');
const errorBox = document.querySelector('#form-error');

const senha = document.querySelector('#senha');
const confirmarSenha = document.querySelector('#confirmar-senha');

function mostrarErro(mensagem) {

    errorBox.textContent = mensagem;
    errorBox.classList.toggle('show', Boolean(mensagem));

}

function senhasConferem() {

    if (!confirmarSenha.value) return true;

    return senha.value === confirmarSenha.value;

}

confirmarSenha.addEventListener('input', () => {

    mostrarErro(senhasConferem() ? '' : 'As senhas não coincidem.');

});

form.addEventListener('submit', (e) => {

    e.preventDefault();

    if (!senhasConferem()) {

        mostrarErro('As senhas não coincidem.');
        confirmarSenha.focus();
        return;

    }

    if (senha.value.length < 6) {

        mostrarErro('A senha deve ter no mínimo 6 caracteres.');
        senha.focus();
        return;

    }

    mostrarErro('');

    button.disabled = true;
    button.innerHTML = 'Criando conta...';
    button.style.opacity = '.7';

    setTimeout(() => {

        button.innerHTML = '<span>Criar conta</span>';
        button.disabled = false;
        button.style.opacity = '1';

    }, 2500);

});