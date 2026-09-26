// LOADER 
window.addEventListener('load', () => {
 
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hide');
        }, 2500);
    }
});

// Mostrar/ocultar senha
document.querySelectorAll('.toggle-password').forEach((toggle) => {

    toggle.addEventListener('click', () => {

        const input = document.querySelector(toggle.dataset.target);

        if (input) {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            toggle.classList.toggle('fa-eye');
            toggle.classList.toggle('fa-eye-slash');
        }

    });

});

const onlyDigits = (value) => value.replace(/\D/g, '');

const masks = {

    cnpj(value) {
        return onlyDigits(value)
            .slice(0, 14)
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
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

// Validação simples: senha e confirmação precisam bater
const fornecedorForm = document.getElementById('fornecedor-form');

if (fornecedorForm) {
    fornecedorForm.addEventListener('submit', (e) => {

        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;
        const erro = document.getElementById('form-error');

        if (senha !== confirmarSenha) {
            e.preventDefault();
            if (erro) erro.textContent = 'As senhas não coincidem!';
        } else if (erro) {
            erro.textContent = '';
        }

    });
}


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
