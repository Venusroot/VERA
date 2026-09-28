<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Capturar os dados enviados pelos 'name' dos inputs do formulário HTML
    $nomeEmpresa   = vera_array_value($_POST, 'nomeEmpresa', '');
    $nomeFantasia  = vera_array_value($_POST, 'nomeFantasia', '');
    $cnpj          = vera_array_value($_POST, 'cnpj', '');
    $logradouro    = vera_array_value($_POST, 'logradouro', '');
    $numero        = vera_array_value($_POST, 'numero', '');
    $cep           = vera_array_value($_POST, 'cep', '');
    $bairro        = vera_array_value($_POST, 'bairro', '');
    $cidade        = vera_array_value($_POST, 'cidade', '');
    $uf            = vera_array_value($_POST, 'uf', '');
    $nacionalidade = !empty($_POST['nacionalidade']) ? $_POST['nacionalidade'] : 'Brasileira';
    $email         = vera_array_value($_POST, 'email', '');
    $telefone      = vera_array_value($_POST, 'telefone', '');
    $senha_usuario = vera_array_value($_POST, 'senha', '');
    $confirmar_senha = vera_array_value($_POST, 'confirmar_senha', '');

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
    $senha_criptografada = vera_password_hash($senha_usuario);

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
        if (vera_array_value($e->errorInfo, 1) === 1062) {
            echo "<script>alert('CNPJ ou e-mail já cadastrado!'); window.history.back();</script>";
        } else {
            echo "Erro ao executar o cadastro: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
        }
    }
}
?>
