<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

/* if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "<pre>";
    print_r($_POST);
    echo "</pre>";
    exit;
} pra ver se foram preenchidos corretamente. só pra testes */ 

$servidor = "localhost";
$usuario = "root";
$senha = "usbw"; 
$banco = "bancov"; 

$conexao = new mysqli($servidor, $usuario, $senha, $banco);

// Verificar se houve erro na conexão
if ($conexao->connect_error) {
    die("Erro na conexão com o banco de dados: " . $conexao->connect_error);
}

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
    $telefone_comercial = $_POST['telefone_comercial'] ?? '';
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

    // SQL exato para a tabela cadusuario (13 colunas correspondentes à sua imagem)
    $sql = "INSERT INTO cadusuario (nome, login, senha, email, cpf, telefone_pessoal, telefone_comercial, logradouro, numero, cep, bairro, cidade, uf) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conexao->prepare($sql);
    
    if ($stmt) {
        // 13 parâmetros string ('s')
        $stmt->bind_param("sssssssssssss", 
            $nome, 
            $login, 
            $senha_criptografada, 
            $email, 
            $cpf, 
            $telefone_pessoal, 
            $telefone_comercial, 
            $logradouro, 
            $numero, 
            $cep, 
            $bairro, 
            $cidade, 
            $uf
        );

        if ($stmt->execute()) {
            echo "<script>alert('Conta criada com sucesso!'); window.location.href='index.html';</script>";
        } else {
            echo "Erro ao executar o cadastro: " . $stmt->error;
        }
        
        $stmt->close();
    } else {
        echo "Erro na preparação da query: " . $conexao->error;
    }

    // Fechar a conexão
    $conexao->close();
}
?>