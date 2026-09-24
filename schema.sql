SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";



-- Criar o banco de dados 'vera' se não existir

CREATE DATABASE IF NOT EXISTS `vera` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;

USE `vera`;



-- Tabela de Fornecedores

CREATE TABLE `cadfornecedor` (

  `id_fornecedor` int(11) NOT NULL AUTO_INCREMENT,

  `nomeEmpresa` varchar(255) NOT NULL,

  `nomeFantasia` varchar(255) NOT NULL,

  `cnpj` varchar(18) NOT NULL,

  `logradouro` varchar(255) NOT NULL,

  `numero` varchar(10) NOT NULL,

  `cep` varchar(9) NOT NULL,

  `bairro` varchar(100) NOT NULL,

  `cidade` varchar(50) NOT NULL,

  `uf` varchar(2) NOT NULL,

  `nacionalidade` varchar(20) NOT NULL,

  `senha` varchar(255) NOT NULL,

  `email` varchar(100) NOT NULL,

  `telefone` varchar(15) NOT NULL,

  PRIMARY KEY (`id_fornecedor`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;



-- Tabela de Produtos

CREATE TABLE `cadproduto` (

  `id_produto` int(11) NOT NULL AUTO_INCREMENT,

  `nome` varchar(255) NOT NULL,

  `tamanho` int(3) NOT NULL,

  `material` varchar(100) NOT NULL,

  `peso` decimal(10,4) NOT NULL,

  `categoria` varchar(100) NOT NULL,

  `preco` decimal(10,2) NOT NULL,

  `descricao` varchar(255) NOT NULL,

  PRIMARY KEY (`id_produto`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;



-- Inserir um produto inicial de teste

INSERT INTO `cadproduto` (`id_produto`, `nome`, `tamanho`, `material`, `peso`, `categoria`, `preco`, `descricao`) VALUES

(1, 'Brinco', 14, 'Ouro', '10.0000', 'outros', '10.00', 'Bala');



-- Tabela de Usuários

CREATE TABLE `cadusuario` (

  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,

  `nome` varchar(255) NOT NULL,

  `login` varchar(255) NOT NULL,

  `senha` varchar(255) NOT NULL,

  `email` varchar(100) NOT NULL,

  `cpf` varchar(14) NOT NULL,

  `telefone` varchar(20) NOT NULL,

  `logradouro` varchar(255) NOT NULL,

  `numero` varchar(10) NOT NULL,

  `cep` varchar(10) NOT NULL,

  `bairro` varchar(100) NOT NULL,

  `cidade` varchar(100) NOT NULL,

  `uf` varchar(2) NOT NULL,

  PRIMARY KEY (`id_usuario`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;



-- Tabela de Estoque

CREATE TABLE `estoqueproduto` (

  `id_estoque` int(11) NOT NULL AUTO_INCREMENT,

  `id_produto` int(11) NOT NULL,

  `id_fornecedor` int(11) NOT NULL,

  `qtdDisponivel` int(11) NOT NULL,

  `precoProduto` decimal(10,2) NOT NULL,

  `nomeProduto` varchar(255) NOT NULL,

  PRIMARY KEY (`id_estoque`),

  KEY `fk_estoque_produto` (`id_produto`),

  KEY `fk_estoque_fornecedor` (`id_fornecedor`),

  CONSTRAINT `fk_estoque_fornecedor` FOREIGN KEY (`id_fornecedor`) REFERENCES `cadfornecedor` (`id_fornecedor`) ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT `fk_estoque_produto` FOREIGN KEY (`id_produto`) REFERENCES `cadproduto` (`id_produto`) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;



-- Tabela de Vendas

CREATE TABLE `venda` (

  `id_venda` int(11) NOT NULL AUTO_INCREMENT,

  `dataVenda` date NOT NULL,

  `qtdVenda` int(11) NOT NULL,

  `precoVenda` decimal(10,2) NOT NULL,

  `formaPag` varchar(100) NOT NULL,

  `id_usuario` int(11) NOT NULL,

  `id_fornecedor` int(11) NOT NULL,

  `id_produto` int(11) NOT NULL,

  PRIMARY KEY (`id_venda`),

  KEY `fk_venda_usuario` (`id_usuario`),

  KEY `fk_venda_fornecedor` (`id_fornecedor`),

  KEY `fk_venda_produto` (`id_produto`),

  CONSTRAINT `fk_venda_fornecedor` FOREIGN KEY (`id_fornecedor`) REFERENCES `cadfornecedor` (`id_fornecedor`) ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT `fk_venda_produto` FOREIGN KEY (`id_produto`) REFERENCES `cadproduto` (`id_produto`) ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT `fk_venda_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `cadusuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;



COMMIT;

