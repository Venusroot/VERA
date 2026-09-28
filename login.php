<?php

session_start();
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.html');
    exit;
}

$identificador = trim(vera_array_value($_POST, 'identificador', vera_array_value($_POST, 'email', '')));
$senha = vera_array_value($_POST, 'senha', '');
$tipo = vera_array_value($_POST, 'tipo_conta', 'usuario');

if ($identificador === '' || $senha === '' || !in_array($tipo, ['usuario', 'fornecedor'], true)) {
    header('Location: login.html?erro=preencha');
    exit;
}

$usuario = false;
$tipoAutenticado = null;
$tiposParaVerificar = [$tipo, $tipo === 'fornecedor' ? 'usuario' : 'fornecedor'];

foreach ($tiposParaVerificar as $tipoVerificado) {
    $sql = $tipoVerificado === 'fornecedor'
        ? 'SELECT id_fornecedor AS id, nomeFantasia AS nome, email, senha FROM cadfornecedor WHERE email = :identificador'
        : 'SELECT id_usuario AS id, nome, email, senha FROM cadusuario WHERE email = :email OR login = :login';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($tipoVerificado === 'fornecedor'
        ? [':identificador' => $identificador]
        : [':email' => $identificador, ':login' => $identificador]);
    $candidato = $stmt->fetch();

    if ($candidato && vera_password_verify($senha, $candidato['senha'])) {
        $usuario = $candidato;
        $tipoAutenticado = $tipoVerificado;
        break;
    }
}

if (!$usuario || $tipoAutenticado === null) {
    header('Location: login.html?erro=credenciais');
    exit;
}

session_regenerate_id(true);
$_SESSION['usuario'] = [
    'id' => (int) $usuario['id'],
    'nome' => $usuario['nome'],
    'email' => $usuario['email'],
    'tipo' => $tipoAutenticado,
];

header('Location: index.html?login=sucesso');
exit;