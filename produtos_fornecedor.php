<?php

require_once __DIR__ . '/compat.php';
date_default_timezone_set('America/Sao_Paulo');
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

require_once __DIR__ . '/conexao_produto.php';

$stmt = $conexao->prepare(
    'SELECT p.id_produto, p.nome, p.tamanho, p.material, p.categoria, p.preco,
            p.quantidade_estoque, p.data_cadastro
     FROM cadproduto p
     INNER JOIN estoqueproduto ep ON ep.id_produto = p.id_produto
     WHERE ep.id_fornecedor = ?
     ORDER BY p.data_cadastro DESC, p.nome ASC'
);
$stmt->bind_param('i', $idFornecedor);
$stmt->execute();
$resultado = $stmt->get_result();
$produtos = [];
while ($produto = $resultado->fetch_assoc()) {
    $produtos[] = $produto;
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
$stmt->close();
$conexao->close();
?>
<!doctype html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Produtos cadastrados | VERA</title>
  <link rel="icon" type="image/png" href="assets/images/faricon.png" />
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/estoque.css" />
  <link rel="stylesheet" href="css/fornecedor.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
</head>

<body>
  <main class="estoque-wrap">
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
        <a href="produtos_fornecedor.php" aria-current="page">Produtos cadastrados</a>
        <a href="estoque.php">Estoque</a>
        <a href="index.html" class="supplier-store-link">Voltar à loja</a>
      </nav>
    </section>

    <header class="estoque-header">
      <div>
        <p class="management-eyebrow">PAINEL DO FORNECEDOR</p>
        <h1>Produtos cadastrados</h1>
      </div>
    </header>

    <section class="supplier-overview" aria-labelledby="catalog-overview-title">
      <div class="supplier-overview-heading">
        <div>
          <p class="supplier-overview-eyebrow">DESEMPENHO DO CATÁLOGO</p>
          <h2 id="catalog-overview-title">Visão geral</h2>
        </div>
        <div class="supplier-health">
          <div class="supplier-health-label">
            <span>Saúde do estoque</span>
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

    <div class="supplier-products-table-wrap">
      <table class="estoque-table supplier-products-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Material</th>
            <th>Tamanho</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Cadastro</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($produtos)): ?>
            <tr><td colspan="7">Você ainda não cadastrou produtos.</td></tr>
          <?php else: ?>
            <?php foreach ($produtos as $produto): ?>
              <tr>
                <td><?= htmlspecialchars($produto['nome'], ENT_QUOTES, 'UTF-8') ?></td>
                <td><?= htmlspecialchars($produto['categoria'], ENT_QUOTES, 'UTF-8') ?></td>
                <td><?= htmlspecialchars($produto['material'], ENT_QUOTES, 'UTF-8') ?></td>
                <td><?= htmlspecialchars($produto['tamanho'], ENT_QUOTES, 'UTF-8') ?></td>
                <td>R$ <?= number_format((float) $produto['preco'], 2, ',', '.') ?></td>
                <td><?= (int) $produto['quantidade_estoque'] ?></td>
                <td><?= date('d/m/Y', strtotime($produto['data_cadastro'])) ?></td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </main>
</body>

</html>