<?php
require_once 'conexao_produto.php';

// Lista de produtos com saldo atual
$produtos = [];
$resultProdutos = $conexao->query("SELECT * FROM cadproduto ORDER BY nome ASC");
while ($linha = $resultProdutos->fetch_assoc()) {
    $produtos[] = $linha;
}

// Últimas movimentações (histórico geral)
$movimentacoes = [];
$sqlHistorico = "SELECT m.*, p.nome AS nome_produto
                  FROM estoque_movimentacao m
                  INNER JOIN cadproduto p ON p.id_produto = m.id_produto
                  ORDER BY m.data_movimentacao DESC
                  LIMIT 30";
$resultHistorico = $conexao->query($sqlHistorico);
while ($linha = $resultHistorico->fetch_assoc()) {
    $movimentacoes[] = $linha;
}
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

</head>

<body>

<!-- Botão de voltar -->
    <a href="cadastrar_produto.html" style="
    position: fixed;
    top: 30px;
    left: 30px;
    z-index: 999;
    font-size: 13px;
    letter-spacing: 2px;
    text-decoration: none;
    color: rgba(22, 20, 20, 0.7);
    background: rgba(0, 0, 0, 0.2);
    padding: 10px 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    transition: 0.4s ease; "> ← Voltar </a>

  <div class="estoque-wrap">

    <div class="estoque-header">
      <h1>Estoque de produtos</h1>
      <a href="cadastro_produto.html" class="newproduct-btn">+ Novo produto</a>
    </div>

    <table class="estoque-table">
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
          <tr><td colspan="7">Nenhum produto cadastrado ainda.</td></tr>
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
                  <input type="number" name="quantidade" min="1" placeholder="Qtd" style="width:70px" required />
                  <input type="text" name="observacao" placeholder="Observação (opcional)" style="width:150px" />
                  <button type="submit">OK</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>

    <div class="historico-section">
      <h2>Últimas movimentações</h2>
      <table class="estoque-table">
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
                <td><?= htmlspecialchars($mov['observacao'] ?? '') ?></td>
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>

  </div>

</body>
</html>
