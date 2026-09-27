# VERA - Marketplace de Alianças

## Projeto Interdisciplinar - Desenvolvimento de Software Multiplataforma | FATEC MAUÁ

## 📖 Sobre o Projeto

O **VERA** é um projeto acadêmico desenvolvido no curso de **Desenvolvimento de Software Multiplataforma (DSM)** da FATEC Mauá, com o objetivo de criar uma plataforma de marketplace especializada na comercialização de alianças, anéis de compromisso, joias e acessórios relacionados a momentos especiais.

O projeto nasceu com a proposta de aplicar conceitos de desenvolvimento web, experiência do usuário (UX), arquitetura de software e gestão de produtos digitais em um cenário real de mercado.

Atualmente, o sistema encontra-se em sua primeira versão funcional, construída utilizando tecnologias de front-end, servindo como base para futuras implementações e evoluções ao longo da graduação.

---

## 🎯 Objetivo

Desenvolver uma plataforma digital capaz de conectar clientes e vendedores especializados em alianças e joias, proporcionando uma experiência de compra intuitiva, segura e moderna.

O VERA busca resolver desafios comuns encontrados em marketplaces tradicionais, oferecendo um ambiente segmentado para um nicho específico, com foco em:

* Facilidade de navegação;
* Experiência personalizada;
* Gestão eficiente de produtos;
* Processo de compra simplificado;
* Escalabilidade para futuras integrações.

---

## 🚀 Tecnologias Utilizadas

Nesta primeira etapa do desenvolvimento, o projeto foi construído utilizando:

* HTML5
* CSS3
* JavaScript (ES6+)
* LocalStorage
* Git
* GitHub

---

## 🏗️ Arquitetura Atual

A aplicação segue uma arquitetura baseada em componentes reutilizáveis utilizando JavaScript puro, priorizando:

* Organização modular do código;
* Separação de responsabilidades;
* Facilidade de manutenção;
* Evolução gradual para arquiteturas mais robustas.

---

## ✨ Funcionalidades Implementadas

### Catálogo de Produtos

* Exibição dinâmica de produtos;
* Cards responsivos;
* Informações detalhadas dos itens;
* Interface otimizada para desktop e dispositivos móveis.

### Sistema de Favoritos

Permite que usuários salvem produtos de interesse para futuras consultas.

### Carrinho de Compras

* Adição de produtos ao carrinho;
* Remoção de itens;
* Atualização automática de quantidades;
* Persistência local utilizando LocalStorage.

### Autenticação Simulada

Estrutura preparada para futura integração com sistemas reais de autenticação.

### Design Responsivo

Interface adaptada para diferentes resoluções de tela.

---

## 📈 Roadmap de Evolução

O projeto foi concebido para crescer ao longo da graduação, incorporando novas tecnologias e conceitos aprendidos nas disciplinas do curso.

### Próximas Implementações

#### Back-end

* Node.js
* Express.js
* APIs REST

#### Banco de Dados

* MySQL

#### Segurança

* JWT Authentication
* Criptografia de senhas
* Controle de acesso por perfil

#### Marketplace Completo

* Cadastro de vendedores;
* Painel administrativo;
* Gestão de estoque;
* Sistema de pedidos;
* Rastreamento de compras;
* Avaliações e comentários.

#### Integrações

* Gateway de pagamento;
* APIs de frete;
* Notificações em tempo real;
* Integração com WhatsApp.

---

## 💻 Conceitos Aplicados

Durante o desenvolvimento do VERA são aplicados conceitos de:

* Desenvolvimento Web Responsivo;
* Estruturas de Dados;
* Programação Orientada a Objetos;
* Engenharia de Software;
* UX/UI Design;
* Versionamento com Git;
* Boas Práticas de Desenvolvimento;
* Arquitetura de Sistemas.

---

## 📊 Diferenciais do Projeto

O VERA não é apenas uma loja virtual, mas uma proposta de marketplace verticalizado para um segmento específico do mercado.

Entre seus diferenciais estão:

* Foco exclusivo em alianças e joias;
* Experiência personalizada para casais;
* Estrutura preparada para múltiplos vendedores;
* Escalabilidade para expansão futura;
* Desenvolvimento orientado por evolução contínua durante a formação acadêmica.

---

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como parte das atividades do curso de:

**Desenvolvimento de Software Multiplataforma (DSM)**
**Faculdade de Tecnologia do Estado de São Paulo – FATEC MAUÁ**

Seu propósito é consolidar conhecimentos técnicos adquiridos ao longo da graduação por meio da construção de uma solução digital real, aplicando metodologias modernas de desenvolvimento de software.

---

### Desenvolvedor

* Desenvolvimento Front-end
* Estruturação da aplicação
* Controle de versão
* Documentação técnica

---

## 🧭 Execução no USBServer

Para rodar este projeto em um ambiente local tipo USBServer, segue a configuração recomendada:

1. Copie toda a pasta do projeto para o diretório web do USBServer.
2. Crie ou importe o banco `vera` no phpMyAdmin/MySQL do seu ambiente.
3. Importe o arquivo `vera.sql`.
4. Acesse a aplicação via navegador usando a pasta do projeto.

A conexão com o banco foi ajustada para aceitar tanto o ambiente de Docker quanto o ambiente local do USBServer. Em ambiente local, o projeto tenta conectar automaticamente com:

- host: `localhost`
- usuário: `root`
- senha: vazia
- banco: `vera`

Se o seu ambiente local usa outro usuário/senha, basta criar variáveis de ambiente antes de iniciar a aplicação:

```bash
DB_HOST=localhost
DB_NAME=vera
DB_USER=root
DB_PASS=
```

No USBServer, normalmente o projeto funciona diretamente sem necessidade de Docker.

---

## 📄 Licença

Este projeto possui caráter acadêmico e educacional.

O código-fonte encontra-se disponível para fins de estudo, aprendizado e demonstração de competências técnicas.

---

### "Transformando momentos especiais em experiências digitais memoráveis."

