<?php
// Siempre iniciar la sesión primero
session_start();

require_once 'db_connection.php';

// Comprobar si el usuario está logueado
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    http_response_code(200);
    echo json_encode([
        'isLoggedIn' => true,
        'user' => [
            'id' => $_SESSION['admin_id'],
            'email' => $_SESSION['admin_email']
        ]
    ]);
} else {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'isLoggedIn' => false,
        'error' => 'No hay una sesión activa.'
    ]);
}
?>