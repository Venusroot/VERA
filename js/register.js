// ===== LOADER =====

window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hide');
        }, 2500);
    }
});

// ===== MOSTRAR / OCULTAR SENHA =====

document.querySelectorAll('.toggle-password').forEach((toggle) => {
    const input = document.querySelector(toggle.dataset.target);
    if (!input) return;

    toggle.addEventListener('click', () => {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
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
            .replace(/(\d{3})(\d)/, '$1.$2')             .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
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
            if (!campo) return;
            campo.disabled = !ativo;
            if (!ativo) campo.value = '';
        });

        camposLocalizacao.forEach((campo) => {
            if (!campo) return;
            campo.disabled = ativo;
            if (ativo) campo.value = '';
        });
    });
}

// ===== VALIDAÇÃO + ENVIO PARA O PHP =====

const form = document.querySelector('#register-form');
const button = document.querySelector('.register-btn');
const errorBox = document.querySelector('#form-error');

const senha = document.querySelector('#senha');
const confirmarSenha = document.querySelector('#confirmar-senha');

function mostrarErro(mensagem) {
    if (!errorBox) return;
    errorBox.textContent = mensagem;
    errorBox.classList.toggle('show', Boolean(mensagem));
}

function senhasConferem() {
    if (!confirmarSenha || !confirmarSenha.value) return true;
    return senha.value === confirmarSenha.value;
}

if (confirmarSenha) {
    confirmarSenha.addEventListener('input', () => {
        mostrarErro(senhasConferem() ? '' : 'As senhas não coincidem.');
    });
}

if (form) {
    form.addEventListener('submit', (e) => {
        // Validação 1: As senhas coincidem?
        if (!senhasConferem()) {
            e.preventDefault(); // Bloqueia apenas se houver erro
            mostrarErro('As senhas não coincidem.');
            confirmarSenha.focus();
            return;
        }

        // Validação 2: A senha tem pelo menos 6 caracteres?
        if (senha && senha.value.length < 6) {
            e.preventDefault(); // Bloqueia apenas se houver erro
            mostrarErro('A senha deve ter no mínimo 6 caracteres.');
            senha.focus();
            return;
        }

        // Se passou em tudo, limpa os erros e deixa o formulário enviar para o PHP livremente!
        mostrarErro('');

        if (button) {
            button.disabled = true;
            button.innerHTML = 'Criando conta...';
            button.style.opacity = '.7';
        }
    });
}