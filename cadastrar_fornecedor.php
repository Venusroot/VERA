<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

$servidor = "localhost";
$usuario  = "root";
$senha_bd = "usbw";
$banco    = "vera";

$conexao = new mysqli($servidor, $usuario, $senha_bd, $banco);
$conexao->set_charset("utf8mb4");

if ($conexao->connect_error) {
    die("Erro na conexão com o banco de dados: " . $conexao->connect_error);
}

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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conexao->prepare($sql);

    if ($stmt) {
        // 13 letras 's' para os 13 parâmetros enviados
        $stmt->bind_param(
            "sssssssssssss",
            $nomeEmpresa,
            $nomeFantasia,
            $cnpj,
            $logradouro,
            $numero,
            $cep,
            $bairro,
            $cidade,
            $uf,
            $nacionalidade,
            $senha_criptografada,
            $email,
            $telefone
        );

        if ($stmt->execute()) {
            echo "<script>alert('Fornecedor cadastrado com sucesso!'); window.location.href='login.html';</script>";
        } else {
            // Código 1062 = entrada duplicada (ex: CNPJ ou e-mail já cadastrado)
            if ($conexao->errno == 1062) {
                echo "<script>alert('CNPJ ou e-mail já cadastrado!'); window.history.back();</script>";
            } else {
                echo "Erro ao executar o cadastro: " . $stmt->error;
            }
        }

        $stmt->close();
    } else {
        echo "Erro na preparação da query: " . $conexao->error;
    }

    $conexao->close();
}
?>
