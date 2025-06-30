<?php
require_once 'db_connection.php';
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->id)) { http_response_code(400); exit(); }

$id = $data->id;
$conn = getDbConnection();
$stmt = $conn->prepare("DELETE FROM contact_phones WHERE id = ?");
$stmt->bind_param("i", $id);
if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
}
$stmt->close();
$conn->close();
?>