<?php
require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || !isset($data->name) || empty(trim($data->name))) {
    http_response_code(400);
    echo json_encode(['error' => 'ID y nombre son requeridos.']);
    exit();
}

$id = $data->id;
$name = trim($data->name);
$conn = getDbConnection();

$stmt = $conn->prepare("UPDATE categories SET name = ? WHERE id = ?");
$stmt->bind_param("si", $name, $id);

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar la categoría.']);
}

$stmt->close();
$conn->close();
?>