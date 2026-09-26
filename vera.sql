-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 26-Set-2026 às 18:13
-- Versão do servidor: 5.7.36
-- versão do PHP: 8.1.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `vera`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `cadfornecedor`
--

CREATE TABLE `cadfornecedor` (
  `id_fornecedor` int(11) NOT NULL,
  `nomeEmpresa` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `nomeFantasia` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `cnpj` varchar(18) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `logradouro` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `numero` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `cep` varchar(9) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `bairro` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `cidade` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `uf` varchar(2) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `nacionalidade` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `telefone` varchar(15) COLLATE utf8mb4_unicode_520_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Extraindo dados da tabela `cadfornecedor`
--

INSERT INTO `cadfornecedor` (`id_fornecedor`, `nomeEmpresa`, `nomeFantasia`, `cnpj`, `logradouro`, `numero`, `cep`, `bairro`, `cidade`, `uf`, `nacionalidade`, `senha`, `email`, `telefone`) VALUES
(1, 'Casado', 'Joja Cola', '10.150.320/1321-32', 'Alameda Ribeirão Preto', '', '01331-000', 'Bela Vista', 'São Paulo', 'SP', 'Brasileira', '$2y$10$2K6AH/VHWgvD/6aD4poMUenDlzY7swPgk.cEwcmcboacePSqB2Q2K', 'Casadodasilva@gmail.com', '');

-- --------------------------------------------------------

--
-- Estrutura da tabela `cadproduto`
--

CREATE TABLE `cadproduto` (
  `id_produto` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `tamanho` varchar(30) NOT NULL,
  `material` varchar(80) NOT NULL,
  `peso` decimal(8,2) NOT NULL,
  `categoria` varchar(80) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `descricao` text,
  `quantidade_estoque` int(11) NOT NULL DEFAULT '0',
  `data_cadastro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `cadproduto`
--

INSERT INTO `cadproduto` (`id_produto`, `nome`, `tamanho`, `material`, `peso`, `categoria`, `preco`, `descricao`, `quantidade_estoque`, `data_cadastro`) VALUES
(4, 'Aliança Maison\' Plaateau', '14', 'Prata', '905.00', 'Aliança', '2550.00', 'Aliança com prata', 4, '2026-09-26 13:28:35'),
(5, 'Pulseira Matiz', '15', 'Ouro 18k', '105.00', 'Pulseira', '129.90', 'Pulseira Matiz uma elegancia jamais vista!', 4, '2026-09-26 14:57:31');

-- --------------------------------------------------------

--
-- Estrutura da tabela `cadusuario`
--

CREATE TABLE `cadusuario` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `login` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `cpf` varchar(14) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `telefone_pessoal` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `telefone_comercial` varchar(20) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `logradouro` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `numero` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `cep` varchar(10) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `bairro` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `cidade` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `uf` varchar(2) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `estrangeiro` varchar(10) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `nacionalidade` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `documento` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Extraindo dados da tabela `cadusuario`
--

INSERT INTO `cadusuario` (`id_usuario`, `nome`, `login`, `senha`, `email`, `cpf`, `telefone_pessoal`, `telefone_comercial`, `logradouro`, `numero`, `cep`, `bairro`, `cidade`, `uf`, `estrangeiro`, `nacionalidade`, `documento`) VALUES
(4, 'pedro souza', 'souzapdr2002', '$2y$10$DdRdnnQ6DSOMBn7UcAdVF.99uzZIIQUtTveqTDtaVRf6H8Ejr6NzC', 'souza97@gmail.com', '547.698.312-57', '(11) 9684-5321', '', 'Avenida Paulista', '654', '01311-200', 'Bela Vista', 'SÃ£o Paulo', 'SP', '0', '', ''),
(5, 'carolina santos', 'carokzls', '$2y$10$ey2HTcsN3bavwGjKptxV7.IF.CBCBfjU8IJprJtFxCpAEBxanYwOW', 'carolzinha123@outlook.com', '956.762.186-24', '(11) 95498-7352', '(11) 96554-6512', 'Avenida Paulista', '300', '01311-200', 'Bela Vista', 'SÃ£o Paulo', 'SP', '0', '', ''),
(6, 'Robson Oliveira', 'robsonoliveira_', '$2y$10$EL62uQQ0hwqej4YL31Ga9.JRE53hSeOXO7w5JjqKBzMmUVSwToFde', 'robson02190@gmail.com', '023.135.305-45', '(11) 9535-4232', '(11) 9654-3200', 'Avenida Paulista', '699', '01311-200', 'Bela Vista', 'SÃ£o Paulo', 'SP', '0', '', ''),
(7, 'Juliana Pereira', 'juliyiyi', '$2y$10$S//UqAGqyNi9rUglYyyr5OkZvoo8rl445R0.mRbdjc/9NQhxnlN5.', 'juliywlp@hotmail.com', '023.120.321-32', '(11) 96532-1056', '(11) 95433-2120', 'Avenida Paulista', '', '01311-200', 'Bela Vista', 'SÃ£o Paulo', 'SP', '0', '', ''),
(8, 'EstevÃ£o Pereira', 'estpereer29', '$2y$10$8DHq/NSghBhjE6NqLy11du.ROFO7IsrLgZcAtqcVpxsdND3anx8iK', 'estpereira2029@gmail.com', '012.310.907-84', '(11) 93789-0238', '(11) 93928-1738', '', '', '', '', '', '', 'Sim', 'Americano', 'USA-2091021389021'),
(12, 'Joãozinho', 'josadjosda', '$2y$10$4WLcLJPcNe250Pgb6ibOuuElVwgPHDJJ/LvyqtP9XRY5uHQvCz09y', 'Joãozinho@gmail.com', '012.389.092-13', '(11) 93892-1732', '', '', '', '', '', '', '', NULL, NULL, NULL),
(16, 'João', '12902109', '$2y$10$ZZOP1GE/9jUSPoqABrh/7OoA8SrlCSVshcuo8mzWJUBivZ9EWQr5e', 'outlook@gmail.com', '021.332.123-12', '(11) 93298-0173', '', 'Alameda Ribeirão Preto', '', '01331-000', 'Bela Vista', 'São Paulo', 'SP', NULL, NULL, NULL),
(18, 'juca silva', '', '$2y$10$JBE3QsKcIPP5TV7tajd.pu/xgTK.QlgtwFKlbP.MitKTdQkB86dMO', '', '023.103.219-03', '(11) 93209-1830', 'Não informado', 'Alameda Ribeirão Preto', '', '01331-000', 'Bela Vista', 'São Paulo', 'SP', 'Não', 'Brasileira', 'Não aplicável'),
(19, 'Gabriel Oliveira', 'gabsjsreact', '$2y$10$FCVVuI.zatl3hl9UrUK4SeBzT.XSHxATkmaCXqAVrOfvRT059wksS', 'gabsjs02@gmail.com', '830.219.082-31', '(11) 93092-1839', 'Não informado', 'Avenida Pedro Ribeiro Malta', '785', '51275-990', 'Ibura', 'Recife', 'PE', 'Não', 'Brasileira', 'Não aplicável');

-- --------------------------------------------------------

--
-- Estrutura da tabela `estoqueproduto`
--

CREATE TABLE `estoqueproduto` (
  `id_produto` int(11) NOT NULL,
  `id_fornecedor` int(11) NOT NULL,
  `qtdDisponivel` int(255) NOT NULL,
  `precoProduto` decimal(10,2) NOT NULL,
  `nomeProduto` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `estoque_movimentacao`
--

CREATE TABLE `estoque_movimentacao` (
  `id_movimentacao` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `tipo` enum('entrada','saida') NOT NULL,
  `quantidade` int(11) NOT NULL,
  `observacao` varchar(255) DEFAULT NULL,
  `data_movimentacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `estoque_movimentacao`
--

INSERT INTO `estoque_movimentacao` (`id_movimentacao`, `id_produto`, `tipo`, `quantidade`, `observacao`, `data_movimentacao`) VALUES
(1, 4, 'entrada', 5, 'Estoque inicial (cadastro do produto)', '2026-09-26 13:28:35'),
(2, 4, 'saida', 1, 'Saiu 1', '2026-09-26 13:39:01'),
(3, 5, 'entrada', 4, 'Estoque inicial (cadastro do produto)', '2026-09-26 14:57:31');

-- --------------------------------------------------------

--
-- Estrutura da tabela `venda`
--

CREATE TABLE `venda` (
  `id_venda` int(11) NOT NULL,
  `dataVenda` date NOT NULL,
  `qtdVenda` int(11) NOT NULL,
  `precoVenda` decimal(10,2) NOT NULL,
  `formaPag` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_fornecedor` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `cadfornecedor`
--
ALTER TABLE `cadfornecedor`
  ADD PRIMARY KEY (`id_fornecedor`);

--
-- Índices para tabela `cadproduto`
--
ALTER TABLE `cadproduto`
  ADD PRIMARY KEY (`id_produto`);

--
-- Índices para tabela `cadusuario`
--
ALTER TABLE `cadusuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Índices para tabela `estoqueproduto`
--
ALTER TABLE `estoqueproduto`
  ADD PRIMARY KEY (`id_produto`);

--
-- Índices para tabela `estoque_movimentacao`
--
ALTER TABLE `estoque_movimentacao`
  ADD PRIMARY KEY (`id_movimentacao`),
  ADD KEY `fk_movimentacao_produto` (`id_produto`);

--
-- Índices para tabela `venda`
--
ALTER TABLE `venda`
  ADD PRIMARY KEY (`id_venda`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cadfornecedor`
--
ALTER TABLE `cadfornecedor`
  MODIFY `id_fornecedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `cadproduto`
--
ALTER TABLE `cadproduto`
  MODIFY `id_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `cadusuario`
--
ALTER TABLE `cadusuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de tabela `estoqueproduto`
--
ALTER TABLE `estoqueproduto`
  MODIFY `id_produto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `estoque_movimentacao`
--
ALTER TABLE `estoque_movimentacao`
  MODIFY `id_movimentacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `venda`
--
ALTER TABLE `venda`
  MODIFY `id_venda` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `estoque_movimentacao`
--
ALTER TABLE `estoque_movimentacao`
  ADD CONSTRAINT `fk_movimentacao_produto` FOREIGN KEY (`id_produto`) REFERENCES `cadproduto` (`id_produto`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
