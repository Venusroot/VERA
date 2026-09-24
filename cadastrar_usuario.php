<?php

require_once __DIR__ . '/db.php';

// Verificar se os dados foram enviados via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Capturar os dados enviados pelos 'name' dos inputs do formulário HTML
    $nome = $_POST['nome'] ?? '';
    $login = $_POST['login'] ?? ''; 
    $email = $_POST['email'] ?? '';
    $senha_usuario = $_POST['senha'] ?? '';
    $confirmar_senha = $_POST['confirmar_senha'] ?? '';
    $cpf = $_POST['cpf'] ?? '';
    $telefone_pessoal = $_POST['telefone_pessoal'] ?? '';
    $telefone_pessoal = $_POST['telefone_pessoal'] ?? '';
    $logradouro = $_POST['logradouro'] ?? '';
    $numero = $_POST['numero'] ?? '';
    $cep = $_POST['cep'] ?? '';
    $bairro = $_POST['bairro'] ?? '';
    $cidade = $_POST['cidade'] ?? '';
    $uf = $_POST['uf'] ?? '';

    // Validação se as senhas coincidem
    if ($senha_usuario !== $confirmar_senha) {
        echo "<script>alert('As senhas não coincidem!'); window.history.back();</script>";
        exit;
    }

    // Criptografar a senha por segurança
    $senha_criptografada = password_hash($senha_usuario, PASSWORD_DEFAULT);

    $sql = "INSERT INTO cadusuario
                (nome, login, senha, email, cpf, telefone, logradouro, numero, cep, bairro, cidade, uf)
            VALUES
                (:nome, :login, :senha, :email, :cpf, :telefone, :logradouro, :numero, :cep, :bairro, :cidade, :uf)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nome' => $nome,
        ':login' => $login,
        ':senha' => $senha_criptografada,
        ':email' => $email,
        ':cpf' => $cpf,
        ':telefone' => $telefone_pessoal,
        ':logradouro' => $logradouro,
        ':numero' => $numero,
        ':cep' => $cep,
        ':bairro' => $bairro,
        ':cidade' => $cidade,
        ':uf' => $uf
    ]);

    echo "<script>alert('Conta criada com sucesso!'); window.location.href='index.html';</script>";
}
?>