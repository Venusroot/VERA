<?php
require_once __DIR__ . '/compat.php';

$servidor = getenv('DB_HOST') ?: 'localhost';
$usuario  = getenv('DB_USER') ?: 'root';
$senha    = getenv('DB_PASS') ?: 'usbw';
$banco    = getenv('DB_NAME') ?: 'vera';
$porta    = (int) (getenv('DB_PORT') ?: '3307');

$conexao = new mysqli($servidor, $usuario, $senha, $banco, $porta);

if ($conexao->connect_error) {
    die("Erro na conexão com o banco de dados: " . $conexao->connect_error);
}

$conexao->set_charset("utf8mb4");
?>
