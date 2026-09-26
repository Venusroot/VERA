<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'conexao_produto.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $id_produto = (int) ($_POST['id_produto'] ?? 0);
    $tipo       = $_POST['tipo'] ?? '';           // 'entrada' ou 'saida'
    $quantidade = (int) ($_POST['quantidade'] ?? 0);
    $observacao = trim($_POST['observacao'] ?? '');

    if ($id_produto <= 0 || !in_array($tipo, ['entrada', 'saida']) || $quantidade <= 0) {
        echo "<script>alert('Dados inválidos para movimentar o estoque!'); window.history.back();</script>";
        exit;
    }

    $conexao->begin_transaction();

    try {
        // Trava a linha do produto para evitar concorrência (dois usuários
        // movimentando o mesmo estoque ao mesmo tempo)
        $stmtSelect = $conexao->prepare("SELECT quantidade_estoque FROM cadproduto WHERE id_produto = ? FOR UPDATE");
        $stmtSelect->bind_param("i", $id_produto);
        $stmtSelect->execute();
        $resultado = $stmtSelect->get_result()->fetch_assoc();
        $stmtSelect->close();

        if (!$resultado) {
            throw new Exception("Produto não encontrado.");
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

        $conexao->commit();

        echo "<script>alert('Estoque atualizado com sucesso!'); window.location.href='estoque.php';</script>";

    } catch (Exception $e) {
        $conexao->rollback();
        echo "<script>alert('" . addslashes($e->getMessage()) . "'); window.history.back();</script>";
    }

    $conexao->close();
}
?>
