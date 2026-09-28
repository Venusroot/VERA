<?php

require_once __DIR__ . '/db.php';

// Verificar se os dados foram enviados via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Capturar os dados enviados pelos 'name' dos inputs do formulário HTML
    $nome = vera_array_value($_POST, 'nome', '');
    $login = vera_array_value($_POST, 'login', '');
    $email = vera_array_value($_POST, 'email', '');
    $senha_usuario = vera_array_value($_POST, 'senha', '');
    $confirmar_senha = vera_array_value($_POST, 'confirmar_senha', '');
    $cpf = vera_array_value($_POST, 'cpf', '');
    $telefone_pessoal = vera_array_value($_POST, 'telefone_pessoal', '');
    $logradouro = vera_array_value($_POST, 'logradouro', '');
    $numero = vera_array_value($_POST, 'numero', '');
    $cep = vera_array_value($_POST, 'cep', '');
    $bairro = vera_array_value($_POST, 'bairro', '');
    $cidade = vera_array_value($_POST, 'cidade', '');
    $uf = vera_array_value($_POST, 'uf', '');

    // Validação se as senhas coincidem
    if ($senha_usuario !== $confirmar_senha) {
        echo "<script>alert('As senhas não coincidem!'); window.history.back();</script>";
        exit;
    }

    // Criptografar a senha por segurança
    $senha_criptografada = vera_password_hash($senha_usuario);

    $sql = "INSERT INTO cadusuario
                (nome, login, senha, email, cpf, telefone, logradouro, numero, cep, bairro, cidade, uf)
            VALUES
                (:nome, :login, :senha, :email, :cpf, :telefone, :logradouro, :numero, :cep, :bairro, :cidade, :uf)";

    try {
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

        header('Location: login.html?cadastro=sucesso');
        exit;
    } catch (PDOException $e) {
        if (vera_array_value($e->errorInfo, 1) === 1062) {
            header('Location: register.html?erro=duplicado');
            exit;
        }

        http_response_code(500);
        echo 'Não foi possível criar a conta. Tente novamente.';
    }
}
?>