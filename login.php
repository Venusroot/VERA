<?php

session_start();
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.html');
    exit;
}

$identificador = trim($_POST['identificador'] ?? $_POST['email'] ?? '');
$senha = $_POST['senha'] ?? '';

if ($identificador === '' || $senha === '') {
    header('Location: login.html?erro=preencha');
    exit;
}

$stmt = $pdo->prepare(
        'SELECT id_usuario AS id, nome, email, senha, \'usuario\' AS tipo
       FROM cadusuario
            WHERE email = :identificador_usuario OR login = :identificador_login
      UNION ALL
     SELECT id_fornecedor AS id, nomeFantasia AS nome, email, senha, \'fornecedor\' AS tipo
       FROM cadfornecedor
            WHERE email = :identificador_fornecedor
      LIMIT 1'
);
$stmt->execute([
        ':identificador_usuario' => $identificador,
        ':identificador_login' => $identificador,
        ':identificador_fornecedor' => $identificador,
]);
$usuario = $stmt->fetch();

if (!$usuario || !password_verify($senha, $usuario['senha'])) {
    header('Location: login.html?erro=credenciais');
    exit;
}

session_regenerate_id(true);
$_SESSION['usuario'] = [
    'id' => (int) $usuario['id'],
    'nome' => $usuario['nome'],
    'email' => $usuario['email'],
    'tipo' => $usuario['tipo'],
];

header('Location: index.html?login=sucesso');
exit;