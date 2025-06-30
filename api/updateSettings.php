<?php
require_once 'db_connection.php';

// --- VALIDACIÓN INICIAL ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.']);
    exit();
}

// --- CORRECCIÓN: Leer el cuerpo de la petición JSON ---
$data = json_decode(file_get_contents("php://input"), true);

// Ahora $data es un array con todas las configuraciones enviadas desde React
$settings_to_update = $data;

if (empty($settings_to_update)) {
    http_response_code(400);
    echo json_encode(['error' => 'No se recibieron datos de texto para actualizar.']);
    exit();
}

$conn = getDbConnection();
$success = true;

// Usamos esta consulta inteligente que actualiza si la clave existe, o la inserta si es nueva.
$stmt = $conn->prepare("INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)");

foreach ($settings_to_update as $key => $value) {
    // Nos aseguramos de no procesar claves que no deberían estar aquí, aunque el frontend ya las filtra.
    if (empty($key)) continue; 
    
    $stmt->bind_param("ss", $key, $value);
    if (!$stmt->execute()) {
        $success = false;
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