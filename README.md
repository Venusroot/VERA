# VERA - Marketplace de Alianças

## Projeto Interdisciplinar - Desenvolvimento de Software Multiplataforma | FATEC MAUÁ

## 📖 Sobre o Projeto

O **VERA** é um projeto acadêmico desenvolvido no curso de **Desenvolvimento de Software Multiplataforma (DSM)** da FATEC Mauá, com o objetivo de criar uma plataforma de marketplace especializada na comercialização de alianças, anéis de compromisso, joias e acessórios relacionados a momentos especiais.

O projeto nasceu com a proposta de aplicar conceitos de desenvolvimento web, experiência do usuário (UX), arquitetura de software e gestão de produtos digitais em um cenário real de mercado.

O sistema possui uma interface em HTML, CSS e JavaScript e um back-end PHP integrado ao MySQL para autenticação, cadastro de clientes e fornecedores, produtos e estoque.

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

O projeto utiliza:

* HTML5
* CSS3
* JavaScript (ES6+)
* PHP 8.2 no ambiente Docker e PHP com `mysqli`/`pdo_mysql` no USBServer
* MySQL 8.0 no ambiente Docker
* LocalStorage para carrinho e favoritos
* Docker Compose (opcional)
* Git
* GitHub

---

## 🏗️ Arquitetura Atual

A aplicação separa as páginas e estilos da interface do back-end PHP, que acessa o MySQL por PDO e MySQLi. O JavaScript puro cuida das interações no navegador, priorizando:

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

### Autenticação

Login e cadastro de clientes e fornecedores são processados pelo PHP, com senhas armazenadas por hash e sessão no servidor. Fornecedores têm acesso às próprias páginas de produtos e estoque.

### Design Responsivo

Interface adaptada para diferentes resoluções de tela.

---

## 📈 Roadmap de Evolução

O projeto foi concebido para crescer ao longo da graduação, incorporando novas tecnologias e conceitos aprendidos nas disciplinas do curso.

### Próximas Implementações

#### Segurança

* Revisão adicional de segurança para produção;
* Validações completas dos dados de cadastro;
* Recuperação de senha e proteção contra tentativas automatizadas.

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

## Execução com Docker

Requisitos: Docker Desktop ou Docker Engine com o comando `docker compose` disponível.

1. Copie `.env.example` para `.env` e ajuste as senhas de desenvolvimento, se necessário.
2. Na pasta do projeto, execute:

```powershell
docker compose up --build
```

3. Acesse `http://localhost:8000` (ou a porta indicada por `WEB_PORT` no `.env`).

O MySQL usa a porta interna 3306 e é publicado apenas em `127.0.0.1:3307` por padrão. Altere `MYSQL_FORWARD_PORT` se a porta já estiver ocupada. O Compose importa `vera.sql` automaticamente somente ao criar o volume de dados pela primeira vez; `db_data` preserva os dados entre reinicializações.

Para encerrar, pressione `Ctrl+C` e execute `docker compose down`. Isso mantém o banco. Evite `docker compose down -v` se quiser preservar os dados.

## Execução no USBServer

Requisitos: Apache/PHP e MySQL. Recomenda-se PHP 8.1 ou superior, com as extensões `mysqli`, `pdo_mysql` e mysqlnd para `mysqli_stmt::get_result()`. O USBServer usado no desenvolvimento inclui PHP 5.4.17, que é legado e não recomendado para exposição pública. Não abra os HTML diretamente pelo sistema de arquivos; use o servidor para que PHP, banco e sessões funcionem.

1. Copie a pasta completa para o diretório web do USBServer.
2. No phpMyAdmin, crie o banco `vera` com charset `utf8mb4` e importe `vera.sql`.
3. Confira o host, usuário, senha e porta MySQL. Os padrões abaixo correspondem à instalação USBServer usada no desenvolvimento.
4. Acesse `http://localhost/<pasta-do-projeto>/index.html`.

Os valores padrão são:

- host: `localhost`
- usuário: `root`
- senha: `usbw`
- porta: `3307`
- banco: `vera`

Se a outra máquina usar valores diferentes, defina `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` e `DB_PORT` no ambiente do Apache/PHP ou ajuste os valores padrão nos dois arquivos de conexão (`db.php` e `conexao_produto.php`). O arquivo `.env` é lido automaticamente pelo Docker Compose, não pelo USBServer.

No USBServer, Docker não é necessário.

## Transferência e observações

Copie a pasta completa, incluindo `assets`, `css`, `js`, `vera.sql`, `Dockerfile` e `docker-compose.yml`. Não é necessário copiar os dados internos de um volume Docker: em uma máquina nova, o banco é criado e preenchido a partir do dump.

`vera.sql` contém registros de demonstração, inclusive dados pessoais e hashes de senha. Revise ou substitua esses registros antes de publicar ou compartilhar o projeto. As senhas de exemplo do Docker são apenas para desenvolvimento local.

Google Fonts, Font Awesome, imagens externas e o ViaCEP dependem de internet. Sem rede, o site ainda abre, mas fontes, ícones, imagens externas e consulta de CEP podem não carregar.

O projeto não requer Node.js/npm nem possui `package.json`.

---

## 📄 Licença

Este projeto possui caráter acadêmico e educacional.

O código-fonte encontra-se disponível para fins de estudo, aprendizado e demonstração de competências técnicas.

---

### "Transformando momentos especiais em experiências digitais memoráveis."

