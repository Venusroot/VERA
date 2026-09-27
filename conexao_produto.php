<?php
// Conexão compartilhada pelas telas de Produto e Estoque (Docker Compose)
$servidor = "db";
$usuario  = "adm";
$senha    = "adm";
$banco    = "vera";

$conexao = new mysqli($servidor, $usuario, $senha, $banco);
$conexao->set_charset("utf8mb4");

if ($conexao->connect_error) {
    die("Erro na conexão com o banco de dados: " . $conexao->connect_error);
}
?>
