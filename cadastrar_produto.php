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
$id_fornecedor = (int) vera_array_value($sessaoUsuario, 'id', 0);
if ($id_fornecedor <= 0) {
    header('Location: login.html?erro=fornecedor');
    exit;
}

require_once 'conexao_produto.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Capturar os dados enviados pelo formulário
    $nome      = vera_array_value($_POST, 'nome', '');
    $tamanho   = vera_array_value($_POST, 'tamanho', '');
    $material  = vera_array_value($_POST, 'material', '');
    $peso      = vera_array_value($_POST, 'peso', '0');
    $categoria = vera_array_value($_POST, 'categoria', '');
    $preco     = vera_array_value($_POST, 'preco', '0');
    $descricao = vera_array_value($_POST, 'descricao', '');
    $quantidade_inicial = isset($_POST['quantidade_inicial']) && $_POST['quantidade_inicial'] !== ''
        ? (int) $_POST['quantidade_inicial']
        : 0;

    // Validação básica dos campos obrigatórios
    if ($nome === '' || $tamanho === '' || $material === '' || $categoria === '') {
        echo "<script>alert('Preencha todos os campos obrigatórios!'); window.history.back();</script>";
        exit;
    }

    // Normalizar números (aceita vírgula ou ponto vindos do formulário)
    $peso  = (float) str_replace(',', '.', $peso);
    $preco = (float) str_replace(',', '.', $preco);

    // Usamos transação para garantir que o produto e o estoque inicial
    // sejam gravados juntos (ou nenhum dos dois, em caso de erro)
    $conexao->autocommit(false);

    try {
        $sql = "INSERT INTO cadproduto (nome, tamanho, material, peso, categoria, preco, descricao, quantidade_estoque)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conexao->prepare($sql);
        if (!$stmt) {
            throw new Exception("Erro na preparação da query: " . $conexao->error);
        }

        $stmt->bind_param(
            "sssdsdsi",
            $nome,
            $tamanho,
            $material,
            $peso,
            $categoria,
            $preco,
            $descricao,
            $quantidade_inicial
        );

        if (!$stmt->execute()) {
            throw new Exception("Erro ao cadastrar produto: " . $stmt->error);
        }

        $id_produto = $conexao->insert_id;
        $stmt->close();

        $stmtEstoque = $conexao->prepare(
            'INSERT INTO estoqueproduto (id_produto, id_fornecedor, qtdDisponivel, precoProduto, nomeProduto)
             VALUES (?, ?, ?, ?, ?)'
        );
        if (!$stmtEstoque) {
            throw new Exception("Erro na preparação do vínculo com o fornecedor: " . $conexao->error);
        }
        $stmtEstoque->bind_param('iiids', $id_produto, $id_fornecedor, $quantidade_inicial, $preco, $nome);
        if (!$stmtEstoque->execute()) {
            throw new Exception("Erro ao vincular o produto ao fornecedor: " . $stmtEstoque->error);
        }
        $stmtEstoque->close();

        // Se foi informada uma quantidade inicial, já registra a
        // primeira movimentação de entrada no histórico de estoque
        if ($quantidade_inicial > 0) {
            $sqlMov = "INSERT INTO estoque_movimentacao (id_produto, tipo, quantidade, observacao)
                       VALUES (?, 'entrada', ?, 'Estoque inicial (cadastro do produto)')";
            $stmtMov = $conexao->prepare($sqlMov);
            $stmtMov->bind_param("ii", $id_produto, $quantidade_inicial);

            if (!$stmtMov->execute()) {
                throw new Exception("Erro ao registrar estoque inicial: " . $stmtMov->error);
            }
            $stmtMov->close();
        }

        $conexao->commit();

        echo "<script>alert('Produto cadastrado com sucesso!'); window.location.href='estoque.php';</script>";

    } catch (Exception $e) {
        $conexao->rollback();
        echo "Erro: " . $e->getMessage();
    }

    $conexao->close();
}
?>
