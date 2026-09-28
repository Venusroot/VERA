<?php
require_once __DIR__ . '/compat.php';
session_start();

$sessaoUsuario = vera_array_value($_SESSION, 'usuario', []);
if (!is_array($sessaoUsuario) || vera_array_value($sessaoUsuario, 'tipo') !== 'fornecedor') {
  header('Location: login.html?erro=fornecedor');
  exit;
}
$idFornecedor = (int) vera_array_value($sessaoUsuario, 'id', 0);
if ($idFornecedor <= 0) {
  header('Location: login.html?erro=fornecedor');
  exit;
}
$nomeFornecedor = htmlspecialchars(vera_array_value($sessaoUsuario, 'nome', 'Fornecedor'), ENT_QUOTES, 'UTF-8');

require_once 'conexao_produto.php';
date_default_timezone_set('America/Sao_Paulo');

// Lista somente produtos vinculados ao fornecedor autenticado.
$produtos = [];
$stmtProdutos = $conexao->prepare(
  'SELECT p.* FROM cadproduto p
   INNER JOIN estoqueproduto ep ON ep.id_produto = p.id_produto
   WHERE ep.id_fornecedor = ?
   ORDER BY p.nome ASC'
);
$stmtProdutos->bind_param('i', $idFornecedor);
$stmtProdutos->execute();
$resultProdutos = $stmtProdutos->get_result();
while ($linha = $resultProdutos->fetch_assoc()) {
    $produtos[] = $linha;
}
$totalProdutos = count($produtos);
$unidadesEstoque = 0;
$produtosBaixoEstoque = 0;
$valorEmEstoque = 0;
foreach ($produtos as $produto) {
  $quantidade = (int) $produto['quantidade_estoque'];
  $unidadesEstoque += $quantidade;
  $valorEmEstoque += (float) $produto['preco'] * $quantidade;
  if ($quantidade <= 3) {
    $produtosBaixoEstoque++;
  }
}
$percentualEstoqueSaudavel = $totalProdutos > 0
  ? (int) round((($totalProdutos - $produtosBaixoEstoque) / $totalProdutos) * 100)
  : 0;
$stmtProdutos->close();

// Histórico limitado aos produtos do fornecedor autenticado.
$movimentacoes = [];
$sqlHistorico = "SELECT m.*, p.nome AS nome_produto
                  FROM estoque_movimentacao m
                  INNER JOIN cadproduto p ON p.id_produto = m.id_produto
          WHERE EXISTS (
            SELECT 1 FROM estoqueproduto ep
            WHERE ep.id_produto = p.id_produto AND ep.id_fornecedor = ?
          )
                  ORDER BY m.data_movimentacao DESC
                  LIMIT 30";
$stmtHistorico = $conexao->prepare($sqlHistorico);
$stmtHistorico->bind_param('i', $idFornecedor);
$stmtHistorico->execute();
$resultHistorico = $stmtHistorico->get_result();
while ($linha = $resultHistorico->fetch_assoc()) {
    $movimentacoes[] = $linha;
}
$stmtHistorico->close();
?>
<!doctype html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Estoque - VERA</title>

  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/produtos.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link rel="stylesheet" href="css/estoque.css" />
  <link rel="stylesheet" href="css/fornecedor.css" />

</head>

<body>

  <div class="estoque-wrap">

    <section class="supplier-workspace" aria-label="Portal do fornecedor">
      <a class="supplier-brand" href="index.html" aria-label="VERA, voltar à loja">
        <img src="assets/images/logo.png" alt="VERA" />
      </a>
      <div class="supplier-workspace-identity">
        <p>ÁREA DO FORNECEDOR</p>
        <strong>Olá, <?= $nomeFornecedor ?></strong>
      </div>
      <nav class="supplier-tabs" aria-label="Abas do fornecedor">
        <a href="cadastro_produto.html">Cadastrar produto</a>
        <a href="produtos_fornecedor.php">Produtos cadastrados</a>
        <a href="estoque.php" aria-current="page">Estoque</a>
        <a href="index.html" class="supplier-store-link">Voltar à loja</a>
      </nav>
    </section>

    <div class="estoque-header">
      <h1>Estoque de produtos</h1>
    </div>

    <section class="supplier-overview" aria-labelledby="stock-overview-title">
      <div class="supplier-overview-heading">
        <div>
          <p class="supplier-overview-eyebrow">ACOMPANHAMENTO DE INVENTÁRIO</p>
          <h2 id="stock-overview-title">Resumo do estoque</h2>
        </div>
        <div class="supplier-health">
          <div class="supplier-health-label">
            <span>Produtos acima do mínimo</span>
            <strong><?= $percentualEstoqueSaudavel ?>%</strong>
          </div>
          <div class="supplier-health-track" role="progressbar" aria-label="Produtos acima do nível mínimo de estoque" aria-valuemin="0" aria-valuemax="100" aria-valuenow="<?= $percentualEstoqueSaudavel ?>">
            <span style="width: <?= $percentualEstoqueSaudavel ?>%"></span>
          </div>
        </div>
      </div>
      <div class="supplier-metrics">
        <div class="supplier-metric">
          <i class="fa-solid fa-gem" aria-hidden="true"></i>
          <div><span>Produtos</span><strong><?= $totalProdutos ?></strong><small>no catálogo</small></div>
        </div>
        <div class="supplier-metric">
          <i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i>
          <div><span>Unidades</span><strong><?= $unidadesEstoque ?></strong><small>disponíveis</small></div>
        </div>
        <div class="supplier-metric supplier-metric-alert">
          <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          <div><span>Reposição</span><strong><?= $produtosBaixoEstoque ?></strong><small>com até 3 unidades</small></div>
        </div>
        <div class="supplier-metric">
          <i class="fa-solid fa-coins" aria-hidden="true"></i>
          <div><span>Valor potencial</span><strong>R$ <?= number_format($valorEmEstoque, 2, ',', '.') ?></strong><small>preço × unidades</small></div>
        </div>
      </div>
    </section>

    <div class="supplier-table-wrap" role="region" aria-label="Tabela de estoque; deslize horizontalmente para ver todas as colunas" tabindex="0">
      <table class="estoque-table supplier-stock-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Tamanho</th>
            <th>Material</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Saldo</th>
            <th>Movimentar</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($produtos)): ?>
            <tr><td colspan="7">Você ainda não cadastrou produtos.</td></tr>
          <?php else: ?>
            <?php foreach ($produtos as $produto): ?>
              <tr>
                <td><?= htmlspecialchars($produto['nome']) ?></td>
                <td><?= htmlspecialchars($produto['tamanho']) ?></td>
                <td><?= htmlspecialchars($produto['material']) ?></td>
                <td><?= htmlspecialchars($produto['categoria']) ?></td>
                <td>R$ <?= number_format((float) $produto['preco'], 2, ',', '.') ?></td>
                <td class="<?= $produto['quantidade_estoque'] <= 3 ? 'saldo-baixo' : '' ?>">
                  <?= (int) $produto['quantidade_estoque'] ?>
                </td>
                <td>
                  <form class="mov-form" action="movimentar_estoque.php" method="POST">
                    <input type="hidden" name="id_produto" value="<?= (int) $produto['id_produto'] ?>" />
                    <select name="tipo" required>
                      <option value="entrada">Entrada</option>
                      <option value="saida">Saída</option>
                    </select>
                    <input type="number" name="quantidade" min="1" placeholder="Qtd" required />
                    <input type="text" name="observacao" placeholder="Observação (opcional)" />
                    <button type="submit">OK</button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>

    <div class="historico-section">
      <h2>Últimas movimentações</h2>
      <div class="supplier-table-wrap" role="region" aria-label="Histórico de movimentações; deslize horizontalmente para ver todas as colunas" tabindex="0">
        <table class="estoque-table supplier-history-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            <?php if (empty($movimentacoes)): ?>
              <tr><td colspan="5">Nenhuma movimentação registrada ainda.</td></tr>
            <?php else: ?>
              <?php foreach ($movimentacoes as $mov): ?>
                <tr>
                  <td><?= date('d/m/Y H:i', strtotime($mov['data_movimentacao'])) ?></td>
                  <td><?= htmlspecialchars($mov['nome_produto']) ?></td>
                  <td><?= $mov['tipo'] === 'entrada' ? 'Entrada' : 'Saída' ?></td>
                  <td><?= (int) $mov['quantidade'] ?></td>
                  <td><?= htmlspecialchars(vera_array_value($mov, 'observacao', '')) ?></td>
                </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>

  </div>

</body>
</html>
