<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

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

require_once 'conexao_produto.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $id_produto = (int) vera_array_value($_POST, 'id_produto', 0);
    $tipo       = vera_array_value($_POST, 'tipo', '');
    $quantidade = (int) vera_array_value($_POST, 'quantidade', 0);
    $observacao = trim(vera_array_value($_POST, 'observacao', ''));

    if ($id_produto <= 0 || !in_array($tipo, ['entrada', 'saida']) || $quantidade <= 0) {
        echo "<script>alert('Dados inválidos para movimentar o estoque!'); window.history.back();</script>";
        exit;
    }

    $conexao->autocommit(false);

    try {
        // Trava a linha do produto para evitar concorrência (dois usuários
        // movimentando o mesmo estoque ao mesmo tempo)
        $stmtSelect = $conexao->prepare(
            'SELECT p.quantidade_estoque FROM cadproduto p
             INNER JOIN estoqueproduto ep ON ep.id_produto = p.id_produto
             WHERE p.id_produto = ? AND ep.id_fornecedor = ?
             FOR UPDATE'
        );
        $stmtSelect->bind_param('ii', $id_produto, $idFornecedor);
        $stmtSelect->execute();
        $resultado = $stmtSelect->get_result()->fetch_assoc();
        $stmtSelect->close();

        if (!$resultado) {
            throw new Exception("Produto não encontrado ou não pertence à sua conta.");
        }

        $saldoAtual = (int) $resultado['quantidade_estoque'];

        if ($tipo === 'saida' && $quantidade > $saldoAtual) {
            throw new Exception("Quantidade insuficiente em estoque (saldo atual: {$saldoAtual}).");
        }

        // Registra a movimentação no histórico
        $sqlMov = "INSERT INTO estoque_movimentacao (id_produto, tipo, quantidade, observacao)
                   VALUES (?, ?, ?, ?)";
        $stmtMov = $conexao->prepare($sqlMov);
        $stmtMov->bind_param("isis", $id_produto, $tipo, $quantidade, $observacao);

        if (!$stmtMov->execute()) {
            throw new Exception("Erro ao registrar movimentação: " . $stmtMov->error);
        }
        $stmtMov->close();

        // Atualiza o saldo consolidado do produto
        $novoSaldo = $tipo === 'entrada' ? $saldoAtual + $quantidade : $saldoAtual - $quantidade;

        $stmtUpdate = $conexao->prepare("UPDATE cadproduto SET quantidade_estoque = ? WHERE id_produto = ?");
        $stmtUpdate->bind_param("ii", $novoSaldo, $id_produto);

        if (!$stmtUpdate->execute()) {
            throw new Exception("Erro ao atualizar saldo do produto: " . $stmtUpdate->error);
        }
        $stmtUpdate->close();

        $stmtUpdateFornecedor = $conexao->prepare(
            'UPDATE estoqueproduto SET qtdDisponivel = ? WHERE id_produto = ? AND id_fornecedor = ?'
        );
        $stmtUpdateFornecedor->bind_param('iii', $novoSaldo, $id_produto, $idFornecedor);
        if (!$stmtUpdateFornecedor->execute()) {
            throw new Exception("Erro ao atualizar o estoque do fornecedor: " . $stmtUpdateFornecedor->error);
        }
        $stmtUpdateFornecedor->close();

        $conexao->commit();

        echo "<script>alert('Estoque atualizado com sucesso!'); window.location.href='estoque.php';</script>";

    } catch (Exception $e) {
        $conexao->rollback();
        echo "<script>alert('" . addslashes($e->getMessage()) . "'); window.history.back();</script>";
    }

    $conexao->close();
}
?>
