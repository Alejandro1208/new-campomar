<?php
require_once 'db_connection.php';
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->id) || !isset($data->display_number) || !isset($data->whatsapp_number)) { http_response_code(400); exit(); }

$id = $data->id;
$display = trim($data->display_number);
$whatsapp = preg_replace('/\D/', '', $data->whatsapp_number);
$conn = getDbConnection();
$stmt = $conn->prepare("UPDATE contact_phones SET display_number = ?, whatsapp_number = ? WHERE id = ?");
$stmt->bind_param("ssi", $display, $whatsapp, $id);
if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
}
$stmt->close();
$conn->close();
?>