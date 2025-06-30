<?php
require_once 'db_connection.php';
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->display_number) || !isset($data->whatsapp_number)) { http_response_code(400); exit(); }

$display = trim($data->display_number);
$whatsapp = preg_replace('/\D/', '', $data->whatsapp_number); // Limpia el número
$conn = getDbConnection();
$stmt = $conn->prepare("INSERT INTO contact_phones (display_number, whatsapp_number) VALUES (?, ?)");
$stmt->bind_param("ss", $display, $whatsapp);
if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
}
$stmt->close();
$conn->close();
?>