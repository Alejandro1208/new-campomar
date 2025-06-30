<?php
require_once 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'No se recibieron datos para actualizar.']);
    exit();
}

$conn = getDbConnection();
$success = true;

// Preparamos una consulta que inserta una nueva clave si no existe, o la actualiza si ya existe.
$stmt = $conn->prepare("
    INSERT INTO site_settings (`key`, `value`) 
    VALUES (?, ?) 
    ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)
");

foreach ($data as $key => $value) {
    $stmt->bind_param("ss", $key, $value);
    if (!$stmt->execute()) {
        $success = false;
        // Podríamos parar aquí o continuar con las demás
    }
}

if ($success) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Configuraciones actualizadas con éxito.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error al actualizar algunas configuraciones.']);
}

$stmt->close();
$conn->close();
?>