<?php

require_once __DIR__ . '/compat.php';

session_start();
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'autenticado' => isset($_SESSION['usuario']),
    'usuario' => vera_array_value($_SESSION, 'usuario'),
], JSON_UNESCAPED_UNICODE);