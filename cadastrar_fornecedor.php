<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Capturar os dados enviados pelos 'name' dos inputs do formulário HTML
    $nomeEmpresa   = $_POST['nomeEmpresa'] ?? '';
    $nomeFantasia  = $_POST['nomeFantasia'] ?? '';
    $cnpj          = $_POST['cnpj'] ?? '';
    $logradouro    = $_POST['logradouro'] ?? '';
    $numero        = $_POST['numero'] ?? '';
    $cep           = $_POST['cep'] ?? '';
    $bairro        = $_POST['bairro'] ?? '';
    $cidade        = $_POST['cidade'] ?? '';
    $uf            = $_POST['uf'] ?? '';
    $nacionalidade = !empty($_POST['nacionalidade']) ? $_POST['nacionalidade'] : 'Brasileira';
    $email         = $_POST['email'] ?? '';
    $telefone      = $_POST['telefone'] ?? '';
    $senha_usuario = $_POST['senha'] ?? '';
    $confirmar_senha = $_POST['confirmar_senha'] ?? '';

    // Validação se as senhas coincidem
    if ($senha_usuario !== $confirmar_senha) {
        echo "<script>alert('As senhas não coincidem!'); window.history.back();</script>";
        exit;
    }

    // Validação básica dos campos obrigatórios
    if ($nomeEmpresa === '' || $nomeFantasia === '' || $cnpj === '' || $email === '' || $senha_usuario === '') {
        echo "<script>alert('Preencha todos os campos obrigatórios!'); window.history.back();</script>";
        exit;
    }

    // Criptografar a senha por segurança
    $senha_criptografada = password_hash($senha_usuario, PASSWORD_DEFAULT);

    $sql = "INSERT INTO cadfornecedor (nomeEmpresa, nomeFantasia, cnpj, logradouro, numero, cep, bairro, cidade, uf, nacionalidade, senha, email, telefone)
            VALUES (:nomeEmpresa, :nomeFantasia, :cnpj, :logradouro, :numero, :cep, :bairro, :cidade, :uf, :nacionalidade, :senha, :email, :telefone)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nomeEmpresa' => $nomeEmpresa,
            ':nomeFantasia' => $nomeFantasia,
            ':cnpj' => $cnpj,
            ':logradouro' => $logradouro,
            ':numero' => $numero,
            ':cep' => $cep,
            ':bairro' => $bairro,
            ':cidade' => $cidade,
            ':uf' => $uf,
            ':nacionalidade' => $nacionalidade,
            ':senha' => $senha_criptografada,
            ':email' => $email,
            ':telefone' => $telefone,
        ]);

        echo "<script>alert('Fornecedor cadastrado com sucesso!'); window.location.href='login.html';</script>";
    } catch (PDOException $e) {
        if (($e->errorInfo[1] ?? null) === 1062) {
            echo "<script>alert('CNPJ ou e-mail já cadastrado!'); window.history.back();</script>";
        } else {
            echo "Erro ao executar o cadastro: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
        }
    }
}
?>
