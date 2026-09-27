<?php
$servidor = getenv('DB_HOST') ?: 'localhost';
$usuario  = getenv('DB_USER') ?: 'root';
$senha    = getenv('DB_PASS') ?: '';
$banco    = getenv('DB_NAME') ?: 'vera';

$conexao = new mysqli($servidor, $usuario, $senha, $banco);
$conexao->set_charset("utf8mb4");

if ($conexao->connect_error) {
    die("Erro na conexão com o banco de dados: " . $conexao->connect_error);
}
?>
