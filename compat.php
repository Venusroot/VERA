<?php

function vera_array_value($values, $key, $default = null)
{
    return isset($values[$key]) ? $values[$key] : $default;
}

function vera_password_hash($password)
{
    if (function_exists('password_hash')) {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    if (!defined('CRYPT_BLOWFISH') || CRYPT_BLOWFISH !== 1) {
        throw new RuntimeException('Este PHP não oferece suporte a bcrypt.');
    }

    $randomBytes = openssl_random_pseudo_bytes(16, $isStrong);
    if ($randomBytes === false || !$isStrong) {
        throw new RuntimeException('Não foi possível gerar um salt seguro para a senha.');
    }

    $salt = '$2y$10$' . substr(strtr(base64_encode($randomBytes), '+', '.'), 0, 22);
    $hash = crypt($password, $salt);

    if (strlen($hash) !== 60 || strpos($hash, '$2y$10$') !== 0) {
        throw new RuntimeException('Não foi possível gerar o hash bcrypt da senha.');
    }

    return $hash;
}

function vera_password_verify($password, $hash)
{
    if (function_exists('password_verify')) {
        return password_verify($password, $hash);
    }

    if (!defined('CRYPT_BLOWFISH') || CRYPT_BLOWFISH !== 1 || strpos($hash, '$2y$') !== 0) {
        return false;
    }

    $calculated = crypt($password, $hash);
    if (strlen($calculated) !== strlen($hash)) {
        return false;
    }

    $difference = 0;
    for ($index = 0; $index < strlen($hash); $index++) {
        $difference |= ord($calculated[$index]) ^ ord($hash[$index]);
    }

    return $difference === 0;
}
?>