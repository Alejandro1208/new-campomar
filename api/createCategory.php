<?php
require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->name) || empty(trim($data->name))) {
    http_response_code(400);
    echo json_encode(['error' => 'El nombre de la categoría es requerido.']);
    exit();
}

$name = trim($data->name);
$conn = getDbConnection();

$stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
$stmt->bind_param("s", $name);

if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al crear la categoría.']);
}

$stmt->close();
$conn->close();
?>